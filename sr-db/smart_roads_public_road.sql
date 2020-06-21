create table road
(
    road_id       serial           not null
        constraint road_pkey
            primary key,
    road_name     text             not null,
    road_lat      double precision not null,
    road_lng      double precision not null,
    default_speed integer          not null,
    warning_speed integer          not null
);

alter table road
    owner to postgres;

INSERT INTO public.road (road_id, road_name, road_lat, road_lng, default_speed, warning_speed) VALUES (3, 'Erdem2', 3.14, 3.45, 45, 41);
INSERT INTO public.road (road_id, road_name, road_lat, road_lng, default_speed, warning_speed) VALUES (4, 'Erdem3', 3.14, 3.45, 45, 41);
INSERT INTO public.road (road_id, road_name, road_lat, road_lng, default_speed, warning_speed) VALUES (5, 'Erdem4', 3.14, 3.45, 45, 41);
INSERT INTO public.road (road_id, road_name, road_lat, road_lng, default_speed, warning_speed) VALUES (6, 'Şair Eşref Bulvarı', 38.432552, 27.143816, 50, 40);
INSERT INTO public.road (road_id, road_name, road_lat, road_lng, default_speed, warning_speed) VALUES (1, 'Erdem', 38.424451, 27.147786, 45, 41);
INSERT INTO public.road (road_id, road_name, road_lat, road_lng, default_speed, warning_speed) VALUES (7, 'D565', 38.475836, 27.232651, 50, 40);
INSERT INTO public.road (road_id, road_name, road_lat, road_lng, default_speed, warning_speed) VALUES (8, 'E87', 38.468716, 27.201208, 50, 40);
INSERT INTO public.road (road_id, road_name, road_lat, road_lng, default_speed, warning_speed) VALUES (11, '273/1. Sk.', 38.454880126531016, 27.19018884330499, 50, 40);
INSERT INTO public.road (road_id, road_name, road_lat, road_lng, default_speed, warning_speed) VALUES (13, 'ExampleRoad', 30.1332, 42.2414, 100, 80);
INSERT INTO public.road (road_id, road_name, road_lat, road_lng, default_speed, warning_speed) VALUES (14, 'D550', 38.455342, 27.16757, 60, 50);