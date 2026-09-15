"use client";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import api from "../axios";
import { Role } from "../interfaces/user";

const CART_SESSION_KEY = "cart_session_id";

const getOrCreateCartSession = () => {
  let sessionId = Cookies.get(CART_SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    Cookies.set(CART_SESSION_KEY, sessionId, { expires: 7 });
  }
  return sessionId;
};

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isFetching = useRef(false);
  const isCreating = useRef(false);
  const lastFetchedId = useRef<string | null>(null);

  const fetchCart = useCallback(async (force = false) => {
    const token = Cookies.get("token");
    const sessionId = getOrCreateCartSession();
    const currentId = token ? `auth_${token.slice(-10)}` : `guest_${sessionId}`;

    if (isFetching.current) return;

    if (!force && lastFetchedId.current === currentId) {
      setLoading(false);
      return;
    }

    isFetching.current = true;
    if (force) setLoading(true);

    const userPublicRaw = Cookies.get("user_public");
    let roles: string[] = [];

    if (userPublicRaw) {
      try {
        const userData = JSON.parse(decodeURIComponent(userPublicRaw));
        roles = userData.roles?.map((r: Role) => r.name) || [];
      } catch (e) {
        console.error(e);
        roles = [];
      }
    }

    const isStaff = roles.some((role) =>
      ["ADMIN", "WORKER", "SUPERADMIN", "HELPDESK"].includes(role),
    );

    if (isStaff) {
      setCart(null);
      setLoading(false);
      isFetching.current = false;
      lastFetchedId.current = currentId;
      return;
    }

    try {
      const param = !token ? sessionId : "auth";
      const res = await api.get(`/api/getCart/${param}`);

      if (res.status === 200) {
        setCart(res.data.data);
        lastFetchedId.current = currentId;
      }
    } catch (error) {
      if ((error as any).response?.status === 404 && !isCreating.current) {
        isCreating.current = true;
        try {
          const createRes = await api.post("/api/createCart", {
            session_token: sessionId,
          });
          setCart(createRes.data.data);
          lastFetchedId.current = currentId;
        } catch (createError) {
          console.error("_CART_CRITICAL_FAILURE_: ", createError);
        } finally {
          isCreating.current = false;
        }
      }
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ cart, fetchCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
