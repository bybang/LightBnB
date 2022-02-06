INSERT INTO users (name, email, password) VALUES ('Bob', 'Bob@bob.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 
('Tony', 'Tony@tony.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 
('Jason', 'Jay@jay.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'sweet house', 'description', 'https://i.imgur.com/73hZDYK.png', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 100, 2, 2, 3, 'Canada', 'fakestreet', 'ghostcity', 'ON', 'V1V2V2', 'TRUE'), 
(2, 'beach house', 'description', 'https://i.imgur.com/73hZDYK.png', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 200, 4, 4, 6, 'Canada', 'fakestreet', 'ghostcity', 'ON', 'V3V3V4', 'FALSE'), 
(3, 'lakeside house', 'description', 'https://i.imgur.com/73hZDYK.png', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 150, 2, 2, 3, 'Canada', 'fakestreet', 'ghostcity', 'ON', 'V5V5V6', 'TRUE');

INSERT INTO reservations (start_date, end_date, property_id, guest_id) VALUES ('2022-10-04', '2022-10-18', 1, 1), ('2022-07-04', '2022-07-18', 2, 3),
('2022-08-14', '2022-08-20', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES
(1, 3, 3, 4, 'messages'),
(2, 1, 2, 3, 'messages'),
(3, 2, 1, 5, 'messages');