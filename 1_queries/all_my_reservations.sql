SELECT reservations.*, properties.*, AVG(rating) as average_rating
FROM reservations
JOIN properties ON property_id = properties.id
JOIN property_reviews ON reservations.id = reservation_id
WHERE reservations.guest_id = 1
AND end_date < now()::date
GROUP BY reservations.id, properties.id
ORDER BY start_date
LIMIT 10;