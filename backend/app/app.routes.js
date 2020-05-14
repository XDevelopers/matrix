import express from "express";
import passport from "passport";
import { findEvents } from "./helpers/gsuite/calendar";
import { userInfo } from "./helpers/gsuite/directory";
import { getRooms } from "./controllers/rooms.controller";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    isAuthenticated: !!req.session.currentUser,
    error: req.query.error,
  });
});

router.get("/rooms", (req, res) => {
  res.json(getRooms());
});

router.get("/xpto", (req, res) => {
  findEvents();
  // userInfo();
  res.json({});
});

router.get("/morpheus*", (req, res) => {
  const { currentUser } = req.session;
  const isAuthenticated = !!currentUser;
  let userString = "";

  if (isAuthenticated) {
    userString = JSON.stringify(currentUser);
  }

  res.render("morpheus", {
    isAuthenticated,
    userString,
  });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/auth/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, profile) => {
      if (err || !profile) {
        const message = (err && err.message) || "Unknown error";
        return res.redirect(`/?error=${encodeURIComponent(message)}`);
      }

      try {
        if (req.headers.cookie.indexOf('mock-matrix') != -1) {
          console.log('mocking...');
          profile.id = '12345';
          profile.name = 'Mr Mock';
          profile.email = 'mock@dextra-sw.com';
        }
      } catch (err) {
        console.log('mock err', err)
      }

      req.session.currentUser = profile;

      return res.redirect("/morpheus");
    })(req, res, next);
  },
);

router.post("/auth/logout", (req, res) => {
  req.session.currentUser = null;
  req.logout();
  res.redirect("/");
});

module.exports = router;
