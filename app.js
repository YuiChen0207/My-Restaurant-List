const axios = require("axios");
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const port = 3000;

const generateRestaurants = require("./Chance");
const restaurantList = generateRestaurants(12);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.pexels.com/v1/search?query=restaurant&per_page=12",
      {
        headers: {
          Authorization:
            "6zTmrjwyG61pg3BkA2Kosbkj4W3AH5yMsf6gOVcCUZ3yRyxzOVW53AKF",
        },
      }
    );
    const photos = response.data.photos;

    // 分頁參數
    const page = parseInt(req.query.page) || 1;
    const perPage = 12;

    // 計算餐廳範圍
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    // 擷取需要顯示的餐廳
    const displayedRestaurants = restaurantList.slice(startIndex, endIndex);

    displayedRestaurants.forEach((restaurant, index) => {
      restaurant.image = photos[index % photos.length].src.original;
    });

    const totalPages = Math.ceil(restaurantList.length / perPage);

    res.render("index", {
      restaurants: displayedRestaurants,
      currentPage: page,
      totalPages: totalPages,
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

  res.render("show", {
    restaurant: showRestaurant,
    restaurants: restaurantList,
  });
});

app.get("/search", (req, res) => {
  const keyword = req.query.keyword.toLowerCase().trim();
  if (!keyword.length) return;
  const restaurants = restaurantList.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(keyword)
  );
  res.render("index", { restaurants, keyword });
});

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
