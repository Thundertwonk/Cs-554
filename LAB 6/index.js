const {
    ApolloServer,
    gql,
    addCatchUndefinedToSchema
} = require('apollo-server');
const lodash = require('lodash');
const axios = require('axios');
const bluebird = require("bluebird");
const redis = require("redis")
const client = redis.createClient();
const xss = require("xss");
const uuid = require("uuid")


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);





let typeDefs = gql `
type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
    numBinned:Int!
}

type Query{
    unsplashImages(pageNum: Int): [ImagePost],
    userPostedImages :[ImagePost],
    binnedImages: [ImagePost],
    getTopTenBinnedPosts:[ImagePost]


}

type Mutation{
    uploadImage(url: String!, description: String, posterName: String, numBinned: Int!):ImagePost,
    deleteImage(id: ID!) :ImagePost,
    updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean, numBinned: Int!):ImagePost

}


`;


const resolvers = {
    Query: {
        unsplashImages: async (_, args) => {
            try {
                const {
                    data
                } = await axios.get('https://api.unsplash.com/photos/?client_id=USzuQR0xh1npAv4WUszupkHYKwiNZOi6PRUnuVB88uo&page=' + args.pageNum);

                for (let i = 0; i < data.length; i++) {
                    data[i].posterName = data[i].user.name;
                    data[i].url = data[i].urls.small;
                    data[i].binned = false;
                    data[i].userPosted = false;
                    data[i].numBinned = data[i].likes
                }

                return data;



            } catch (err) {
                console.error(err);
            }
        },
        userPostedImages: async () => {

            let userList = [];
            let idlist = await client.lrangeAsync("images", 0, -1);
            try {
                for (let id of idlist) {
                    let dat = await client.hgetallAsync(id);

                    if (dat.binned) {

                        if (dat.binned == "true") {
                            dat.binned = true;
                        } else {
                            dat.binned = false;
                        }
                    }
                    if (dat.userPosted) {

                        if (dat.userPosted == "true") {
                            dat.userPosted = true;
                        } else {
                            dat.userPosted = false;
                        }
                    }

                    if (dat.userPosted === true) {
                        userList.push(dat);
                    }


                }



                return userList;
            } catch (err) {
                console.log(err);

            }


        },
        binnedImages: async () => {

            let imageList = [];
            let idlist = await client.lrangeAsync("images", 0, -1);
            try {
                for (let id of idlist) {
                    let dat = await client.hgetallAsync(id);
                    if (dat.binned) {

                        if (dat.binned == "true") {
                            dat.binned = true;
                        } else {
                            dat.binned = false;
                        }
                    }
                    if (dat.userPosted) {

                        if (dat.userPosted == "true") {
                            dat.userPosted = true;
                        } else {
                            dat.userPosted = false;
                        }
                    }
                    if (dat.binned === true) {
                        if (dat.description == 'null')
                            dat.description = undefined;
                        if (dat.posterName === null) {
                            dat.posterName = " "
                        }
                        imageList.push(dat);
                    }
                }

            } catch (err) {
                console.log(err);

            }
            return imageList;

        },
        getTopTenBinnedPosts: async () => {
            try {
                let likesArr = [];
                let binnedList = await client.lrangeAsync("images", 0, -1);

                for (let id of binnedList) {
                    let post = await client.hgetallAsync(id);

                     if (post.binned) {

                        if (post.binned == "true") {
                            post.binned = true;
                        } else {
                            post.binned = false;
                        }
                    }
                    if (post.userPosted) {

                        if (post.userPosted == "true") {
                            post.userPosted = true;
                        } else {
                            post.userPosted = false;
                        }
                    }
                    if (post.binned === true && post.numBinned > 0) {
                        likesArr.push(post);
                    }


                }
                likesArr.sort((a, b) => (b.numBinned) - (a.numBinned));
                return likesArr.slice(0, 10);


            } catch (err) {
                console.log(err);

            }

        }


    },


    Mutation: {
        uploadImage: async (_, args) => {
            try {


                if (!args.url) throw "Please submit a url";
                if (!args.posterName || typeof (args.posterName) !== 'string') {
                    args.posterName = " "
                }
                if (!args.description) {
                    args.description = " "
                }
                if (!args.binned || args.binned === null) {
                    args.binned = false
                }

                if (!args.userPosted || args.userPosted === null) {
                    args.userPosted = true;
                }
                let jsonStuff = {

                    id: uuid.v4(),
                    url: args.url,
                    posterName: args.posterName,
                    description: args.description,
                    userPosted: args.userPosted,
                    binned: args.binned,
                    numBinned: args.numBinned

                };

                for (let key in jsonStuff)
                    await client.hsetAsync(jsonStuff.id, key, jsonStuff[key]);

                await client.lpushAsync("images", jsonStuff.id);
                return jsonStuff;
            } catch (err) {
                console.log(err);

            }


        },


        deleteImage: async (_, args) => {
            if (!args.id) throw "id";
            let dat = await client.hgetallAsync(args.id);
            if (dat.binned) dat.binned = (dat.binned == "true");
            if (dat.userPosted) dat.userPosted = (dat.userPosted == "true");
            try {
                if (dat.binned)
                    await client.hsetAsync(dat.id, "userPosted", false);
                else {
                    await client.delAsync(dat.id);
                    await client.lremAsync("images", 1, dat.id);
                }
            } catch (err) {
                console.log(err);

            }
            return dat;


        },

        updateImage: async (_, args) => {
            if (!args.id) throw `Lack id`;
            if (args.description === null) {
                args.description = " "
            }
            if (args.posterName === null) {
                args.posterName = " "
            }
            if (typeof args.userPosted == `string`) {
            if(args.userPosted == 'true'){
                args.userPosted=true;
            }
            else{
                args.userPosted=false;
            }};
            if (typeof args.binned == `string`) {
                if(args.binned == 'true'){
                    args.binned=true;
                }
                else{
                    args.binned=false;
                }};
            let dat = {
                id: args.id,
                url: args.url,
                posterName: args.posterName,
                description: args.description,
                userPosted: args.userPosted,
                binned: args.binned,
                numBinned: args.numBinned

            };
            let exists = await client.existsAsync(args.id);

            if (args.binned) {

                try {
                    if (exists) {
                        await client.hsetAsync(dat.id, "binned", true);

                        return dat;
                    }
                    for (let key in dat)
                        await client.hsetAsync(dat.id, key, dat[key]);
                    await client.lpushAsync("images", dat.id);
                } catch (err) {
                    console.log(err);

                }
            } else {
                try {

                    if (args.userPosted) {
                        await client.hsetAsync(dat.id, "binned", false);
                    } else {
                        await client.delAsync(dat.id);
                        await client.lremAsync("images", 1, dat.id);
                    }
                } catch (err) {
                    console.log(err);

                }
            }

            return dat;
        }
    }
};










const server = new ApolloServer({
    typeDefs,
    resolvers
});

// The `listen` method launches a web server.
server.listen().then(({
    url
}) => {
    console.log(`🚀  Server ready at ${url}`);
});