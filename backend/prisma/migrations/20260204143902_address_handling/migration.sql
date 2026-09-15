CREATE
OR REPLACE PROCEDURE insert_address(
	p_user_id INTEGER,
	p_country_name TEXT,
	p_city_name TEXT,
	p_postal_code TEXT,
	p_street_name TEXT,
	p_house_number TEXT,
	p_floor TEXT,
	p_door TEXT
) LANGUAGE plpgsql AS $$-- 
DECLARE v_country_id INTEGER;
v_city_id INTEGER;
v_street_id INTEGER;
BEGIN-- 
INSERT INTO countries(name)VALUES(p_country_name)
ON CONFLICT (name) DO UPDATE 
SET name = EXCLUDED.name RETURNING id INTO v_country_id;
INSERT INTO cities(name,
postal_code)
VALUES(p_city_name,
p_postal_code)
ON CONFLICT (name,
postal_code) DO UPDATE 
SET name = EXCLUDED.name RETURNING id INTO v_city_id;
INSERT INTO streets(name)VALUES(p_street_name)
ON CONFLICT (name) DO UPDATE 
SET name = EXCLUDED.name RETURNING id INTO v_street_id;
INSERT INTO addresses(
	user_id,
	country_id,
	city_id,
	street_id,
	house_number,
	"floor",
	door,
	created_at,
	updated_at
)
VALUES(
	p_user_id,
	v_country_id,
	v_city_id,
	v_street_id,
	p_house_number,
	p_floor,
	p_door,
	NOW(),
	NOW()
);
COMMIT;

END;
$$;
CREATE
OR REPLACE PROCEDURE update_address(
	p_address_id INTEGER,
	p_country_name TEXT DEFAULT NULL,
	p_city_name TEXT DEFAULT NULL,
	p_postal_code TEXT DEFAULT NULL,
	p_street_name TEXT DEFAULT NULL,
	p_house_number TEXT DEFAULT NULL,
	p_floor TEXT DEFAULT NULL,
	p_door TEXT DEFAULT NULL
) LANGUAGE plpgsql AS $$ 
DECLARE
v_country_id INTEGER;
v_city_id INTEGER;
v_street_id INTEGER;
BEGIN 
	IF p_country_name IS NOT NULL AND p_country_name <> '' THEN
		INSERT INTO countries (name) VALUES (p_country_name) 
		ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name 
		RETURNING id INTO v_country_id;
	END IF;
	IF p_city_name IS NOT NULL AND p_city_name <> '' AND p_postal_code IS NOT NULL 
		AND p_postal_code <> '' THEN
		INSERT INTO cities (name, postal_code) VALUES (p_city_name, p_postal_code)
		ON CONFLICT (name, postal_code) DO UPDATE SET name = EXCLUDED.name,
		postal_code = EXCLUDED.postal_code RETURNING id INTO v_city_id;
	END IF;
	IF p_street_name IS NOT NULL AND p_city_name <> '' THEN
		INSERT INTO streets (name) VALUES (p_street_name) ON CONFLICT (name) DO
		UPDATE SET name = EXCLUDED.name RETURNING id INTO v_street_id;
	END IF;

	UPDATE addresses
	SET 
		country_id = COALESCE(v_country_id, country_id),
		city_id = COALESCE(v_city_id, country_id),
		street_id = COALESCE(v_street_id, street_id),
		house_number = COALESCE(p_house_number, house_number),
		"floor" = COALESCE(p_floor, "floor"),
		door = COALESCE(p_door, door),
		updated_at = NOW()
	WHERE id = p_address_id AND (
		country_id IS DISTINCT FROM COALESCE(v_country_id, country_id) OR
		city_id IS DISTINCT FROM COALESCE(v_city_id, city_id) OR
		street_id IS DISTINCT FROM COALESCE(v_street_id, street_id) OR
		house_number IS DISTINCT FROM COALESCE(p_house_number, house_number) OR
		"floor" IS DISTINCT FROM COALESCE(p_floor, "floor") OR 
		door IS DISTINCT FROM COALESCE(p_door, door)
	);
END;
$$
