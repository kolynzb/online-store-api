const router = require("express").Router();

router.route("/").get((req, res) => res.send("user route"));
module.exports = router;
