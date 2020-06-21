create table warning
(
    road_id      integer not null
        constraint road_id
            references road
            on update cascade on delete cascade,
    warning_type integer not null
);

alter table warning
    owner to postgres;

INSERT INTO public.warning (road_id, warning_type) VALUES (1, 2);
INSERT INTO public.warning (road_id, warning_type) VALUES (7, 1);