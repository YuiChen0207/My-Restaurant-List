const Chance = require("chance");
const chance = new Chance();

const generateRestaurants = (count) => {
  const restaurants = [];

  for (let i = 0; i < count; i++) {
    const restaurant = {
      id: i + 1,
      name: chance.name(),
      name_en: chance.name(),
      category: chance.pickone([
        "Middle Eastern",
        "Japanese",
        "Italian",
        "American",
      ]),
      image: chance.url({ domain: "example.com" }),
      location: chance.address(),
      phone: chance.phone(),
      google_map: chance.url({ domain: "goo.gl" }),
      rating: chance.floating({ min: 3, max: 5, fixed: 1 }),
      area: chance.city(),
      seating_capacity: chance.integer({ min: 20, max: 100 }),
      restaurant_style: chance.pickone(["Traditional", "Modern", "Romantic"]),
      online_reservation: chance.bool(),
      payment_methods: chance.pickset(
        ["Cash", "Credit Card", "Mobile Payment"],
        chance.integer({ min: 1, max: 3 })
      ),
    };

    restaurants.push(restaurant);
  }

  return restaurants;
};

module.exports = generateRestaurants;
