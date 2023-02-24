const { moment, Notes } = require("../config/config");

exports.homePage = async (req, res, next) => {
    res.status(200).send("Home Page!!!");
};

exports.addNote = async (req, res, next) => {
    let params = req.body;
    if (!params.title) return res.json({ code: 412, message: "Title is missing", data: [] });
    if (!params.note) return res.json({ code: 412, message: "Note is missing", data: [] });
    
    let data = [];
    let msg = "";

    if(params.id>0) {
        await Notes.update({
            title: params.title,
            note: params.note,
        },
        {
            where: {id: params.id}
        }).then(async res => {
            console.log(res);
            msg = "Note updated successfully";
            obj = await fetchNote(params.id);
            data = {id:obj.id, title: obj.title, note: obj.note, status: obj.status, created_at: moment(obj.created_at).format("YYYY-MM-DD HH:mm:ss"), updated_at: moment(obj.updated_at).format("YYYY-MM-DD HH:mm:ss")};
        }).catch((error) => {
            console.error('Failed to create a new record : ', error);
        });
    } else {
        await Notes.create({
            title: params.title,
            note: params.note,
            status: 1,
        }).then(res => {
            console.log(res, res.id, res.title);
            msg = "Note added successfully";
            data = {id:res.id, title: res.title, note: res.note, status: res.status, created_at: moment(res.created_at).format("YYYY-MM-DD HH:mm:ss"), updated_at: moment(res.updated_at).format("YYYY-MM-DD HH:mm:ss")};
        }).catch((error) => {
            console.error('Failed to create a new record : ', error);
        });
    }

    return res.json({
        code: 200,
        status: true, 
        message: msg,
        data: data
    });
}

exports.deleteNote = async (req, res, next) => {
    let params = req.body;
    if (!params.id) return res.json({ code: 412, message: "Note Id is missing", data: [] });

    await Notes.update({
        status: 0,
    },
    {
        where: {id: params.id}
    }).then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to create a new record : ', error);
    });

    return res.json({
        code: 200,
        status: true, 
        message: "Note deleted successfully"
    });
}

exports.getNotes = async (req, res, next) => {
    let params = req.body;
    
    let rows = [];

    await Notes.findAll(
        {
            where: {status: 1},
            raw:true
        },
    )
    .then((row) => {
        for(let i in row) {
            row[i].created_at = moment(row[i].created_at).format("YYYY-MM-DD HH:mm:ss");
        }
        rows = row;
        console.log(row);
    })
    .catch((error) => {
        console.log(error);
    });
    
    return res.json({
        code: 200,
        status: true, 
        data: rows
    });
}

async function fetchNote(id) {
    console.log(id);
    let rows = [];

    await Notes.findOne(
        {
            where: {id: id},
            raw:true
        },
    )
    .then((row) => {
        for(let i in row) {
            row[i].created_at = moment(row[i].created_at).format("YYYY-MM-DD HH:mm:ss");
        }
        rows = row;
        console.log(row);
    })
    .catch((error) => {
        console.log(error);
    });
    
    return rows;
}