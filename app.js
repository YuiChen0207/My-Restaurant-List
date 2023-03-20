// require packages used in the project
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const port = 3000;
const restaurantList = require("./restaurant.json");

// setting template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// setting static files
app.use(express.static("public"));

// routes setting
app.get("/", (req, res) => {
  res.render("index", { restaurants: restaurantList.results });
});

app.get("/restaurants/:restaurant_id", (req, res) => {
  const restaurantId = req.params.restaurant_id;
  const showRestaurant = restaurantList.results.find(
    (restaurant) => restaurant.id.toString() === restaurantId
  );
  res.render("show", { restaurant: showRestaurant });
});


app.get("/search", (req, res) => {
  const keyword = req.query.keyword.toLowerCase().trim();
  if (!keyword.length) return;
  const restaurants = restaurantList.results.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(keyword)
  );
  res.render("index", { restaurants, keyword });
});


//不建議如此使用因會造成前後端混淆
//若是找不到keyword則alert並返回上一頁
//在node下使用js語法alert及window.history.back()達到相同效果
/*   if (!restaurants.length) {
    return res.send(
      "<script>alert('Can not find " +
        keyword +
        "');window.history.back();</script>"
    );
  } */

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
