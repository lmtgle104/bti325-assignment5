
const Sequelize = require('sequelize');

var sequelize = new Sequelize('SenecaDB', 'lmtgle104', 'xbTFS6jBWuJ3', {
    host: 'ep-still-bar-01236231.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

const Post = sequelize.define("Post", {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN,
    category: Sequelize.STRING
});

const Category = sequelize.define('Category', {
    category: Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: 'category'});

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then((data) => {
            resolve(data);
        }).catch(err => reject("unable to sync the database"));
    });
};

module.exports.getAllPosts = () => {
    return new Promise((resolve, reject) => {
        Post.findAll().then((data) =>{
            resolve(data);
        }).catch(err => reject("no results returned"));
    });
};

module.exports.getPublishedPosts = () => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where:{
                published: true
            }
        }).then(data => {
            resolve(data);
        }).catch(err => reject("no results returned"));
    });
};

module.exports.getCategories = () => {
    return new Promise((resolve, reject) => {
        Category.findAll().then(data =>{
            resolve(data);
        }).catch(err => reject("no results returned"));
    });
};

module.exports.addPost = (postData) => {
    return new Promise((resolve, reject) => {
        postData.published = (postData.published) ? true : false;
        for (var i in postData) 
        {
            if (i == "")
            {
                i = null;
            }
        }

        postData.postDate = new Date();
        Post.create({
            title: postData.title ,
            body: postData.body,
            postDate: postData.postDate,
            featureImage: postData.featureImage,
            published: postData.published,
            category: postData.category
        }).then( 
            resolve()).catch(err => reject("unable to create post"))
    });
}

module.exports.getPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                category: category
            }
        }).then((data) => {
            resolve(data);
        }).catch(err => reject("no results returned"));
    });
};

module.exports.getPostsByMinDate = (minDateStr) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                postDate: { $gte: new Date(minDateStr)} 
            }
        }).then(data => {
            resolve(data);
        }).catch(err => reject("no results returned"));
    });
};

module.exports.getPostById = (id) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                id: id
            }
        }).then(data => {
            resolve(data[0]);
        }).catch(err => reject("no results returned"));
    });
};

module.exports.getPublishedPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true,
                category: category
            }
        }).then(data => {
            resolve(data);
        }).catch(err => reject("no results returned"));
    });
};

module.exports.addCategory = (categoryData) => {
    return new Promise((resolve, reject) => {
        for (i in categoryData)
        {
            if (i == "")
            {
                i = null;
            }
        }
        Category.create({
           category: categoryData.category
        }).then(resolve()).catch(err => reject('could not create an category'))
    });
}

module.exports.deleteCategoryById = (id) => {
    return new Promise((resolve, reject) =>
    {
        Category.destroy({
            where: {
                id: id
            }
        }).then(() => resolve()).catch((err) => reject('could not delete the category'))
    });
}

module.exports.deletePostById = (id) => {
    return new Promise((resolve, reject) =>
    {
        Post.destroy({
            where: {
            id: id
        }}).then(() => resolve()).catch(() => reject('could not delete the post'))
    })
}
