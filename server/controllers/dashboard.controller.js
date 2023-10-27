const Note = require("../models/notes")

exports.dashboard = async (req, res, id) => {
    let showPage = 8
    let page = req.query.page || 1
    const locals = {
        title: 'Dashboard',
        description: 'NodeJs Note App'
    }
    try {
        const notes = await Note.aggregate([
            { $sort: { updatedAt: -1 } }, {
                $project: {
                    title: { $substr: ['$title', 0, 30] },
                    body: { $substr: ['$body', 0, 100] }
                }
            }
        ])
            .skip(showPage * page - showPage)
            .limit(showPage)
            .exec()
        const count = await Note.count()
        res.render('dashboard/index', {
            userName: req.user._conditions._id.displayName,
            locals,
            notes,
            layout: '../views/layouts/dashboard',
            current: page,
            pages: Math.ceil(count / showPage)
        })

    } catch (error) {
        console.log(error);
    }
}

exports.getViewNote = async (req, res) => {
    const note = await Note.findById({ _id: req.params.id })
        .where({ user: req.user.id }).lean()
    if (note) {
        res.render('dashboard/viewNotes', {
            noteId: req.param.id,
            note,
            layout: '../views/layouts/dashboard',
        })
    } else {
        res.send('Something wrong ...')
    }
}

exports.updateViewNote = async (req, res) => {
    try {
        await Note.findOneAndUpdate(
            { _id: req.params.id },
            { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
        ).where({ user: req.user.id });
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
    }
}

exports.addViewNote = async (req, res) => {
    res.render("dashboard/addNote", {
        layout: "../views/layouts/dashboard"
    })
}

exports.addNoteSubmit = async (req, res) => {
    try {
        await Note.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
    }
}

exports.deleteViewNote = async (req, res) => {
    try {
        await Note.deleteOne({ _id: req.params.id })
            .where({ user: req.user.id })
        res.redirect('/dashboard')

    } catch (error) {
        console.log(error);
    }
}

exports.searchByNote = (req, res) => {
    try {
        res.render('dashboard/search', {
            searchResult: '',
            layout: "../views/layouts/dashboard"
        })
    } catch (error) {
        console.log(error);
    }
}

exports.searchSumbitViewNote = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm
        const searchCharacter = searchTerm.replace(/[^a-zA-Z0-9]/g, "")
        const searchResult = await Note.find({
            $or: [
                { title: { $regex: new RegExp(searchCharacter, 'i') } },
                { body: { $regex: new RegExp(searchCharacter, "i") } }
            ]
        }).where({ user: req.user.id })
        res.render('dashboard/search', {
            searchResult,
            layout: '../views/layouts/dashboard'
        })
    } catch (error) {
        console.log(error);
    }
}