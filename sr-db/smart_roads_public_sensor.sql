create table sensor
(
    sensor_id  serial           not null
        constraint sensor_pkey
            primary key,
    road_id    integer          not null
        constraint sensor_road_road_id_fk
            references road
            on update cascade on delete cascade,
    sensor_lat double precision not null,
    sensor_lng double precision not null
);

alter table sensor
    owner to postgres;

INSERT INTO public.sensor (sensor_id, road_id, sensor_lat, sensor_lng) VALUES (1, 1, 38.424274, 27.146381);
INSERT INTO public.sensor (sensor_id, road_id, sensor_lat, sensor_lng) VALUES (2, 1, 38.424089, 27.144825);
INSERT INTO public.sensor (sensor_id, road_id, sensor_lat, sensor_lng) VALUES (4, 1, 38.413, 34.234);
INSERT INTO public.sensor (sensor_id, road_id, sensor_lat, sensor_lng) VALUES (5, 7, 38.463537, 27.227029);
INSERT INTO public.sensor (sensor_id, road_id, sensor_lat, sensor_lng) VALUES (6, 7, 38.469081, 27.228209);
INSERT INTO public.sensor (sensor_id, road_id, sensor_lat, sensor_lng) VALUES (7, 7, 38.472693, 27.230408);
INSERT INTO public.sensor (sensor_id, road_id, sensor_lat, sensor_lng) VALUES (8, 7, 38.479841, 27.238122);
INSERT INTO public.sensor (sensor_id, road_id, sensor_lat, sensor_lng) VALUES (10, 11, 38.454880126531016, 27.19018884330499);
INSERT INTO public.sensor (sensor_id, road_id, sensor_lat, sensor_lng) VALUES (11, 11, 38.45483228124299, 27.190089746444393);
INSERT INTO public.sensor (sensor_id, road_id, sensor_lat, sensor_lng) VALUES (12, 8, 38.463287, 27.204975);
INSERT INTO public.sensor (sensor_id, road_id, sensor_lat, sensor_lng) VALUES (13, 8, 38.464908, 27.204009);
INSERT INTO public.sensor (sensor_id, road_id, sensor_lat, sensor_lng) VALUES (14, 8, 38.469033, 27.201198);
INSERT INTO public.sensor (sensor_id, road_id, sensor_lat, sensor_lng) VALUES (19, 14, 38.455342, 27.16757);
INSERT INTO public.sensor (sensor_id, road_id, sensor_lat, sensor_lng) VALUES (20, 6, 38.426432, 27.139855);