-- ============================================================================
-- World Cup 2026 Match Center — seed data
-- Mirrors lib/seed-data.ts so a fresh Supabase project matches the bundled demo.
-- Run AFTER schema.sql.
-- ============================================================================

-- Stadiums ------------------------------------------------------------------
insert into public.stadiums (id, name, city, country, capacity, image) values
('azteca',   'Estadio Azteca',         'Mexico City',    'Mexico', 87523, 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1400&q=80'),
('metlife',  'MetLife Stadium',        'East Rutherford','USA',    82500, 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1400&q=80'),
('att',      'AT&T Stadium',           'Arlington',      'USA',    80000, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1400&q=80'),
('sofi',     'SoFi Stadium',           'Inglewood',      'USA',    70240, 'https://images.unsplash.com/photo-1540552965541-37a52ea60bb1?auto=format&fit=crop&w=1400&q=80'),
('mercedes', 'Mercedes-Benz Stadium',  'Atlanta',        'USA',    71000, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=80'),
('nrg',      'NRG Stadium',            'Houston',        'USA',    72220, 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1400&q=80'),
('arrowhead','Arrowhead Stadium',      'Kansas City',    'USA',    76416, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1400&q=80'),
('lincoln',  'Lincoln Financial Field','Philadelphia',   'USA',    69596, 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?auto=format&fit=crop&w=1400&q=80'),
('gillette', 'Gillette Stadium',       'Foxborough',     'USA',    65878, 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1400&q=80'),
('hardrock', 'Hard Rock Stadium',      'Miami Gardens',  'USA',    64767, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1400&q=80'),
('levis',    'Levi''s Stadium',        'Santa Clara',    'USA',    68500, 'https://images.unsplash.com/photo-1540552965541-37a52ea60bb1?auto=format&fit=crop&w=1400&q=80'),
('lumen',    'Lumen Field',            'Seattle',        'USA',    68740, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=80'),
('akron',    'Estadio Akron',          'Guadalajara',    'Mexico', 48071, 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1400&q=80'),
('bbva',     'Estadio BBVA',           'Monterrey',      'Mexico', 53500, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1400&q=80'),
('bmo',      'BMO Field',              'Toronto',        'Canada', 45500, 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?auto=format&fit=crop&w=1400&q=80'),
('bcplace',  'BC Place',               'Vancouver',      'Canada', 54500, 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1400&q=80')
on conflict (id) do update set
  name = excluded.name, city = excluded.city, country = excluded.country,
  capacity = excluded.capacity, image = excluded.image;

-- Teams ---------------------------------------------------------------------
insert into public.teams (id, name, code, group_name) values
('mex','Mexico','mx','A'),
('can','Canada','ca','B'),
('usa','United States','us','D'),
('arg','Argentina','ar','C'),
('bra','Brazil','br','E'),
('fra','France','fr','F'),
('eng','England','gb-eng','G'),
('esp','Spain','es','H'),
('ger','Germany','de','A'),
('por','Portugal','pt','B'),
('ned','Netherlands','nl','C'),
('bel','Belgium','be','D'),
('cro','Croatia','hr','E'),
('uru','Uruguay','uy','F'),
('jpn','Japan','jp','G'),
('mar','Morocco','ma','H')
on conflict (id) do update set
  name = excluded.name, code = excluded.code, group_name = excluded.group_name;

-- Matches -------------------------------------------------------------------
-- `status` is set to 'upcoming' here; the sync job (or your own cron) flips it
-- to 'live'/'finished' and fills scores from the football API.
insert into public.matches
  (id, stage, group_name, kickoff, status, home_team_id, away_team_id, stadium_id) values
('m01','Group Stage','A','2026-06-11 00:00:00+00','upcoming','mex','ger','azteca'),
('m02','Group Stage','B','2026-06-12 20:00:00+00','upcoming','can','por','bmo'),
('m03','Group Stage','D','2026-06-12 23:00:00+00','upcoming','usa','bel','sofi'),
('m04','Group Stage','C','2026-06-13 19:00:00+00','upcoming','arg','ned','metlife'),
('m05','Group Stage','E','2026-06-13 22:00:00+00','upcoming','bra','cro','mercedes'),
('m06','Group Stage','F','2026-06-14 18:00:00+00','upcoming','fra','uru','att'),
('m07','Group Stage','G','2026-06-14 21:00:00+00','upcoming','eng','jpn','lumen'),
('m08','Group Stage','H','2026-06-15 20:00:00+00','upcoming','esp','mar','hardrock'),
('m09','Group Stage','A','2026-06-18 23:00:00+00','upcoming','ger','mex','nrg'),
('m10','Group Stage','C','2026-06-19 19:00:00+00','upcoming','ned','arg','lincoln'),
('m11','Group Stage','E','2026-06-20 22:00:00+00','upcoming','cro','bra','levis'),
('m12','Group Stage','F','2026-06-21 18:00:00+00','upcoming','uru','fra','arrowhead'),
('m13','Round of 32',null,'2026-06-28 20:00:00+00','upcoming','arg','jpn','akron'),
('m14','Round of 16',null,'2026-07-04 23:00:00+00','upcoming','bra','esp','bbva'),
('m15','Quarter Final',null,'2026-07-10 21:00:00+00','upcoming','fra','eng','gillette'),
('m16','Semi Final',null,'2026-07-14 23:00:00+00','upcoming','arg','bra','att'),
('m17','Third Place',null,'2026-07-18 20:00:00+00','upcoming','esp','fra','hardrock'),
('m18','Final',null,'2026-07-19 19:00:00+00','upcoming','arg','bra','metlife')
on conflict (id) do update set
  stage = excluded.stage, group_name = excluded.group_name, kickoff = excluded.kickoff,
  home_team_id = excluded.home_team_id, away_team_id = excluded.away_team_id,
  stadium_id = excluded.stadium_id;
