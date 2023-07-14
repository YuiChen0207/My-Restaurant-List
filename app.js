const axios = require("axios");
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const port = 3000;
const generateRestaurants = require("./Chance");
const restaurantList = generateRestaurants(50);

const handlebarsOptions = {
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
  },
};

app.engine(
  "handlebars",
  exphbs({ defaultLayout: "main", ...handlebarsOptions })
);

app.set("view engine", "handlebars");

app.use(express.static("public"));

app.get("/restaurants/page/:page", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.pexels.com/v1/search?query=restaurant&per_page=50",
      {
        headers: {
          Authorization:
            "6zTmrjwyG61pg3BkA2Kosbkj4W3AH5yMsf6gOVcCUZ3yRyxzOVW53AKF",
        },
      }
    );
    const photos = response.data.photos;

    restaurantList.forEach((restaurant, index) => {
      restaurant.image = photos[index % photos.length].src.original;
    });

    const page = parseInt(req.params.page) || 1;
    console.log(page);
    const perPage = 12;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const displayedRestaurants = restaurantList.slice(startIndex, endIndex);

    res.render("index", {
      restaurants: displayedRestaurants,
      currentPage: page,
    });
  } catch (error) {
    console.error("發生錯誤:", error);
    res.render("index", { restaurants: restaurantList });
  }
});

app.get("/restaurants/:restaurant_name", async (req, res) => {
  const restaurantName = req.params.restaurant_name;
  const showRestaurant = restaurantList.find(
    (restaurant) => restaurant.name === restaurantName
  );

  const slicedRestaurants = restaurantList
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  res.render("show", {
    restaurant: showRestaurant,
    restaurants: restaurantList,
    slicedRestaurants,
  });
});

app.get("/search", (req, res) => {
  const keyword = req.query.keyword.toLowerCase().trim();
  if (!keyword.length) return;

  const restaurants = restaurantList.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(keyword) ||
      restaurant.category.toLowerCase().includes(keyword)
  );
  res.render("index", { restaurants, keyword });
});

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
