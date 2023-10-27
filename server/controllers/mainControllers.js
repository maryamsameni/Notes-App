exports.homePage = async (req, res) => {
    const locals = {
        title: 'Home - Note App',
        description: 'NodeJs Note App'
    }
    res.render('index', {
        locals,
        layout: '../views/layouts/frontPage'
    })
}