-- Show specific details about properties located in Vancouver including their average rating.

Select properties.id, title, cost_per_night,AVG(property_reviews.rating) AS average_rating
from properties
LEFT JOIN property_reviews ON property_reviews.property_id=properties.id
WHERE city LIKE '%ancouv%'
GROUP BY properties.id
HAVING AVG(property_reviews.rating)>=4
ORDER BY cost_per_night
LIMIT 10;
