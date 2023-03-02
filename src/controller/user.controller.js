const { UserModel } = require("../model/User.model");

exports.get_random_word = async (req, res) => {
    let words = ["guddu","suddu","shaurbha","sanku","masai","jayho","ramchandra","jay shree ram","jaymatadi","yogesh","nurupul","sanjay","mohmad","rahul","shaul","soal","tomato","potatow","ramu","shaymu","MNwBOJr","bJARAKm","SzaVJEK","nWCpvTG","XSgVJHx","acnXnMC","TBNkJzf","PwgSGTw","brRgxkm","JOevYBO","PuDUPyO","KBnsdOb","xudvREX","eYmQSaS","JmzugBq","nZdURxF","wgzJyve","SPpqPEh","snhBjRc","KwuhCDR"]

    try {
        let word = words[Math.floor(Math.random()*words.length)];
        return res.status(201).send({ word: word })
    }
    catch (error) {
        return res.status(500).send({ error: true, message: "Internal Server Error" })
    }
}
exports.post_user = async (req, res) => {
    const { name, score, difficulty } = req.body;
    try {
        const newUser = new UserModel({ name, score, difficulty });
        await newUser.save();
        return res.status(201).send({ meassage: "User created sucessfully with score", "user": newUser })
    }
    catch (error) {
        return res.status(500).send({ error: true, message: "Internal Server Error" })
    }
}

exports.DeleteUser = async (req, res) => {
    const id = req.params.id.split(":").map(String)[1];
    console.log(id);
    const exist = await UserModel.findOne({ "_id": id });
    if (!exist) {
        return res.status(401).send({ message: "user allredy deleted from Users" })
    } else {
        try {
            await UserModel.findOneAndDelete({ "_id": id })
            return res.status(202).send({ message: "User deleted successfully" })
        } catch (error) {
            console.log(error)
            res.status(400).send({ "err": "Somthing went wrong" })
        }
    }
}


exports.getUsers = async (req, res) => {

    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        let sort = req.query.sort || "score";
        let difficulty = req.query.category || "All"
        const difficultyOption = [
            "easy", "medium", "hard"
        ];
        difficulty == "All" ? (difficulty = [...difficultyOption]) : (difficulty = req.query.difficulty.split(","));
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
        let sortBy = {};
        if (sort[1]) {
            sortBy[sort[0]] = sort[1];
        } else {
            sortBy[sort[0]] = "asc"
        }

        const post = await UserModel.find({ name: { $regex: search, $options: "i" } }).where("diffculty").in([...difficulty]).sort(sortBy).skip(page * limit).limit(limit);
        const total = await UserModel.countDocuments({
            difficulty: { $in: [...difficulty] },
            name: { $regex: search, $options: "i" },
        });
        const response = {
            error: false,
            total, page: page + 1,
            limit,
            difficulty: difficultyOption,
            post
        }
        return res.status(200).send(response);
    } catch (error) {
        console.log(err);
        res.status(500).send({ error: true, message: "Internal Server Error" })
    }
}
