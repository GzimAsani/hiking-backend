import express from "express";
import { HttpRequestHandlers } from "../htpp-middleware/request-handlers";
import multer from "multer";
import path from "path";
import { GridFsStorage } from "multer-gridfs-storage";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "src/uploads/profileImages",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
});

const pastTrailImageStorage = new GridFsStorage({
  url:
    "mongodb+srv://root:root@cluster0.ybirikr.mongodb.net/hiking-app?retryWrites=true&w=majority" ||
    "",
  file: (req, file) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      return {
        bucketName: "images",
        filename: `${Date.now()}_${file.originalname}`,
      };
    } else {
      return `${Date.now()}_${file.originalname}`;
    }
  },
});

export const pastTrailImageUpload = multer({ storage: pastTrailImageStorage });

router.get("/users", HttpRequestHandlers.data);
router.get("/users/:userId", HttpRequestHandlers.getUser);
router.post("/users", HttpRequestHandlers.signup);
router.delete("/users/:userId", HttpRequestHandlers.deleteUser);
router.get("/users/email/:email", HttpRequestHandlers.getUserByEmail);
router.post("/login", HttpRequestHandlers.login);
router.post(
  "/users/:userId/favorites/:trailId",
  HttpRequestHandlers.addFavoriteTrail
);
router.delete(
  "/users/:userId/favorites/:trailId",
  HttpRequestHandlers.removeFavoriteTrail
);
router.get("/users/:userId/favorites", HttpRequestHandlers.readFavoriteTrails);
router.put("/users/:userId", HttpRequestHandlers.updateUser);
router.get("/reminders", HttpRequestHandlers.getAllReminders);
router.get("/reminders/:reminderId", HttpRequestHandlers.getReminderById);
router.get("/reminders/user/:userId", HttpRequestHandlers.getUserReminders);

router.post(
  "/users/:userId/user-trails",
  pastTrailImageUpload.array("images"),
  HttpRequestHandlers.addPastTrail
);
router.get(
  "/users/:userId/user-trails/:trailId",
  HttpRequestHandlers.getSinglePastTrail
);
router.get("/pastTrailimages/:imageId", HttpRequestHandlers.getPastTrailImage);
router.delete(
  "/users/:userId/user-trails/:trailId",
  HttpRequestHandlers.removePastTrail
);
router.get("/users/:userId/user-trails", HttpRequestHandlers.getPastTrails);

router.get("/trails", HttpRequestHandlers.getAllTrails);
router.get("/trails/:trailId", HttpRequestHandlers.getTrail);
router.post("/trails", HttpRequestHandlers.createTrail);
router.put("/trails/:trailId", HttpRequestHandlers.updateTrail);
router.delete("/trails/:trailId", HttpRequestHandlers.deleteTrail);
router.post(
  "/trails/:trailId/reviews/:userId",
  HttpRequestHandlers.rateAndReviewTrail
);
router.put(
  "/trails/:trailId/reviews/:userId",
  HttpRequestHandlers.updateRateAndReviewTrail
);
router.delete(
  "/trails/:trailId/reviews/:userId",
  HttpRequestHandlers.deleteReviewTrail
);
router.get("/trails/:trailId/reviews", HttpRequestHandlers.getAllReviews);
router.get("/hikeBuddies", HttpRequestHandlers.getHikeBuddies);
router.post("/hikeBuddies/search", HttpRequestHandlers.searchHikeBuddies);

router.get("/trails/trail/:trailName", HttpRequestHandlers.getTrailByName);

router.get("/events", HttpRequestHandlers.getAllEvents);
router.get("/events/:eventId", HttpRequestHandlers.getEventById);
router.post(
  "/events/trailId/:trailId/creatorId/:creatorId",
  HttpRequestHandlers.saveEvent
);
router.delete(
  "/events/:eventId/:creatorId",
  HttpRequestHandlers.deleteEventById
);
router.post(
  "/events/:eventId/creatorId/:creatorId",
  HttpRequestHandlers.updateEventById
);
router.post("/events/join/:eventId/:userId", HttpRequestHandlers.joinEvent);
router.delete("/events/leave/:eventId/:userId", HttpRequestHandlers.leaveEvent);

router.get('/blogs', HttpRequestHandlers.getAllBlogs);
router.get('/blogs/:blogsId', HttpRequestHandlers.getBlogsById);
router.post('/blogs/:authorId', pastTrailImageUpload.array("images"), HttpRequestHandlers.saveBlog);
router.delete('/blogs/:blogId/:authorId', HttpRequestHandlers.deleteBlogById);
router.put('/blogs/:blogId/', HttpRequestHandlers.updateBlog);

router.get('/reviews', HttpRequestHandlers.getAllReviewsComponent);
router.get('/reviews/:reviewId', HttpRequestHandlers.getAllReviewsById);
router.post('/reviews', HttpRequestHandlers.saveReviews);
router.delete('/reviews/:reviewId/:authorId', HttpRequestHandlers.deleteReview);
router.put('/reviews/:reviewId', HttpRequestHandlers.updateReview);




router.post(
  '/users/:userId/profilePicture',
  pastTrailImageUpload.single('images'),
  HttpRequestHandlers.uploadProfilePicture
);

router.get('/images/:filename', HttpRequestHandlers.readImageFromBucket)

export default router;
