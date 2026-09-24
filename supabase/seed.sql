-- ============================================================
-- VELO MOTORS — demo inventory (12 vehicles)
-- Run this AFTER schema.sql, in the Supabase SQL Editor.
-- All data here is placeholder/demo data.
-- ============================================================

insert into vehicles
  (make, model, year, trim, price, mileage, condition, body_type, fuel_type, transmission,
   drivetrain, engine, horsepower, exterior_color, interior_color, description,
   stock_number, vin, status, featured, features)
values
('Mercedes-Benz','GLE',2023,'GLE 350',68900,8200,'Certified Pre-Owned','SUV','Gasoline','Automatic','AWD','2.0L Turbo I4',255,'Obsidian Black','Black Leather','A certified GLE with the full luxury SUV package — air suspension, panoramic roof, and Mercedes'' driver-assist suite.','VM-1001','4JGFB4KE0PA123456','available',true,
 '{"Safety":["Blind Spot Monitoring","Lane Assist","Parking Sensors","360 Camera"],"Comfort":["Heated Seats","Ventilated Seats","Panoramic Roof"],"Technology":["Apple CarPlay","Android Auto","MBUX Navigation"],"Performance":["AWD","Turbo Engine","Air Suspension"]}'::jsonb),

('BMW','X5',2022,'xDrive40i',54200,19400,'Used','SUV','Gasoline','Automatic','AWD','3.0L Turbo I6',335,'Alpine White','Cognac Leather','One-owner X5 with the M Sport package, adaptive suspension, and a clean Carfax.','VM-1002','5UXCR6C05N9123456','available',true,
 '{"Safety":["Backup Camera","Lane Assist"],"Comfort":["Heated Seats","Power Seats"],"Technology":["Apple CarPlay","Navigation"],"Performance":["AWD","Turbo Engine","Sport Mode"]}'::jsonb),

('Toyota','Land Cruiser',2021,'Heritage Edition',61500,31200,'Used','SUV','Gasoline','Automatic','4WD','5.7L V8',381,'Sandstorm','Sand Leather','Legendary reliability with true 4WD capability. Recently serviced with new tires.','VM-1003','JTMHY7AJ7M4123456','available',false,
 '{"Safety":["Backup Camera","Blind Spot Monitoring"],"Comfort":["Heated Seats","Third-Row Seating"],"Technology":["Navigation","Bluetooth"],"Performance":["4WD","Off-Road Suspension"]}'::jsonb),

('Lexus','RX',2023,'RX 350',48700,11300,'Certified Pre-Owned','SUV','Gasoline','Automatic','AWD','2.4L Turbo I4',275,'Nightfall Mica','Birch Leather','Comfort-focused luxury SUV with Lexus Safety System+ and a whisper-quiet cabin.','VM-1004','2T2HZMDA8PC123456','available',true,
 '{"Safety":["Lane Assist","Blind Spot Monitoring","Parking Sensors"],"Comfort":["Heated Seats","Ventilated Seats","Climate Control"],"Technology":["Apple CarPlay","Android Auto"],"Performance":["AWD","Turbo Engine"]}'::jsonb),

('Land Rover','Range Rover Sport',2022,'HSE',72300,22100,'Used','SUV','Gasoline','Automatic','4WD','3.0L Turbo I6',355,'Santorini Black','Ebony Leather','HSE trim with air suspension and the off-road terrain response system.','VM-1005','SALWR2SU0NA123456','available',false,
 '{"Safety":["360 Camera","Parking Sensors"],"Comfort":["Heated Seats","Massage Seats","Panoramic Roof"],"Technology":["Navigation","Meridian Sound"],"Performance":["4WD","Air Suspension","Turbo Engine"]}'::jsonb),

('Mercedes-Benz','C-Class',2022,'C 300',39900,16700,'Used','Sedan','Gasoline','Automatic','RWD','2.0L Turbo I4',255,'Polar White','Black MB-Tex','Sharp, well-optioned C 300 with the Premium package and a clean inspection report.','VM-1006','55SWF8DB0NU123456','available',false,
 '{"Safety":["Backup Camera","Blind Spot Monitoring"],"Comfort":["Heated Seats"],"Technology":["Apple CarPlay","MBUX"],"Performance":["Turbo Engine","Sport Mode"]}'::jsonb),

('BMW','5 Series',2021,'530i',36800,28300,'Used','Sedan','Gasoline','Automatic','RWD','2.0L Turbo I4',248,'Jet Black','Black Sensatec','Executive sedan with adaptive cruise control and a spacious, tech-forward cabin.','VM-1007','WBA13AG05MW123456','available',false,
 '{"Safety":["Lane Assist","Backup Camera"],"Comfort":["Heated Seats","Power Seats"],"Technology":["Navigation","Bluetooth"],"Performance":["Sport Mode"]}'::jsonb),

('Toyota','Camry',2020,'SE',18900,42100,'Used','Sedan','Gasoline','Automatic','FWD','2.5L I4',203,'Celestial Silver','Black Cloth','Reliable commuter with excellent fuel economy and a spotless maintenance history.','VM-1008','4T1G11AK0LU123456','available',false,
 '{"Safety":["Backup Camera"],"Comfort":["Climate Control"],"Technology":["Apple CarPlay","Bluetooth"],"Performance":[]}'::jsonb),

('Honda','Accord',2021,'Sport',22400,25600,'Used','Sedan','Gasoline','Automatic','FWD','1.5L Turbo I4',192,'Modern Steel','Black Cloth','Sport trim with paddle shifters, a firmer suspension tune, and low ownership costs.','VM-1009','1HGCV1F30MA123456','available',false,
 '{"Safety":["Lane Assist","Backup Camera"],"Comfort":["Heated Seats"],"Technology":["Apple CarPlay","Android Auto"],"Performance":["Turbo Engine","Sport Mode"]}'::jsonb),

('Porsche','Cayenne',2022,'Base',66900,14200,'Certified Pre-Owned','SUV','Gasoline','Automatic','AWD','3.0L Turbo V6',335,'Jet Black Metallic','Bordeaux Red Leather','Genuine Porsche driving dynamics in an SUV body — air suspension and Sport Chrono included.','VM-1010','WP1AA2AY0ND123456','reserved',true,
 '{"Safety":["360 Camera","Parking Sensors"],"Comfort":["Heated Seats","Ventilated Seats"],"Technology":["Navigation","Bose Sound"],"Performance":["AWD","Turbo Engine","Sport Chrono"]}'::jsonb),

('Audi','Q8',2023,'Premium Plus',64200,9800,'Certified Pre-Owned','SUV','Gasoline','Automatic','AWD','3.0L Turbo V6',335,'Glacier White','Black Valcona Leather','Coupe-SUV styling with quattro all-wheel drive and Audi''s virtual cockpit.','VM-1011','WA1LVAF10PD123456','available',false,
 '{"Safety":["Blind Spot Monitoring","360 Camera"],"Comfort":["Heated Seats","Panoramic Roof"],"Technology":["Virtual Cockpit","Navigation"],"Performance":["AWD","Turbo Engine"]}'::jsonb),

('Tesla','Model Y',2023,'Long Range',46800,12100,'Used','SUV','Electric','Automatic','AWD',null,384,'Pearl White','All Black','Dual-motor Long Range with Autopilot and over 300 miles of estimated range.','VM-1012','7SAYGDEE0PF123456','available',true,
 '{"Safety":["Autopilot","360 Camera"],"Comfort":["Heated Seats","Panoramic Glass Roof"],"Technology":["17in Touchscreen","Over-the-air Updates"],"Performance":["AWD","Instant Torque"]}'::jsonb);

-- Placeholder image for every seeded vehicle (swap for real photos via the
-- admin dashboard's image upload once you're set up).
insert into vehicle_images (vehicle_id, image_url, display_order)
select id, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80', 0
from vehicles
where stock_number like 'VM-10%';
