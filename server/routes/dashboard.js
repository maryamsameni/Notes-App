const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboard.controller')
const { isLoggedIn } = require('../middleware/checkAuth')

router.get('/dashboard', isLoggedIn, dashboardController.dashboard)
router.get("/dashboard/item/:id", isLoggedIn, dashboardController.getViewNote)
router.put("/dashboard/item/:id", isLoggedIn, dashboardController.updateViewNote)
router.delete("/dashboard/delete/:id", isLoggedIn, dashboardController.deleteViewNote)
router.get("/dashboard/add", isLoggedIn, dashboardController.addViewNote)
router.post("/dashboard/addNote", isLoggedIn, dashboardController.addNoteSubmit)
router.get("/dashboard/search", isLoggedIn, dashboardController.searchByNote)
router.post("/dashboard/search", isLoggedIn, dashboardController.searchSumbitViewNote)

module.exports = router
