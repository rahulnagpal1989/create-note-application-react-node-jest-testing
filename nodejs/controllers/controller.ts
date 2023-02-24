const { moment, Notes } = require("../config/config");
import {Request, Response, NextFunction} from 'express';

interface Idata {
    id: number;
    title: string;
    note: string;
    created_at: string;
}

exports.homePage = async (req:Request, res:Response, next:NextFunction) => {
    res.status(200).send("Home Page!!!");
};

exports.addNote = async (req:Request, res:Response, next:NextFunction) => {
    let params = req.body;
    if (!params.title) return res.json({ code: 412, message: "Title is missing", data: [] });
    if (!params.note) return res.json({ code: 412, message: "Note is missing", data: [] });
    
    let rows:Array<Idata> = [{id:0, title: "", note: "", created_at: ""}];
    let msg = "";

    if(params.id>0) {
        await Notes.update({
            title: params.title,
            note: params.note,
        },
        {
            where: {id: params.id}
        }).then(async (res:any) => {
            msg = "Note updated successfully";
            let obj:any = await fetchNote(params.id);
            rows = [{id:obj[0].id, title: obj[0].title, note: obj[0].note, created_at: obj[0].created_at}];
        }).catch((error:any) => {
            console.error('Failed to create a new record : ', error);
        });
    } else {
        await Notes.create({
            title: params.title,
            note: params.note,
            status: 1,
        }).then((res:any) => {
            msg = "Note added successfully";
            rows = [{id:res.id, title: res.title, note: res.note, created_at: moment(res.created_at).format("YYYY-MM-DD HH:mm:ss")}];
        }).catch((error:any) => {
            console.error('Failed to create a new record : ', error);
        });
    }
    
    return res.json({
        code: 200,
        status: true, 
        message: msg,
        data: rows[0].id>0 ? rows : []
    });
}

exports.deleteNote = async (req:Request, res:Response, next:NextFunction) => {
    let params = req.body;
    if (!params.id) return res.json({ code: 412, message: "Note Id is missing", data: [] });

    await Notes.update({
        status: 0,
    },
    {
        where: {id: params.id}
    }).then((res:any) => {
        console.log(res)
    }).catch((error:any) => {
        console.error('Failed to create a new record : ', error);
    });

    return res.json({
        code: 200,
        status: true, 
        message: "Note deleted successfully"
    });
}

exports.getNotes = async (req:Request, res:Response, next:NextFunction) => {
    let params = req.body;
    
    let rows:Array<Idata> = [{id:0, title: "", note: "", created_at: ""}];

    await Notes.findAll(
        {
            attributes: ['id', 'title', 'note', 'created_at'],
            where: {status: 1},
            raw:true
        },
    )
    .then((row:any) => {
        for(let i in row) {
            row[i].created_at = moment(row[i].created_at).format("YYYY-MM-DD HH:mm:ss");
        }
        rows = row;
    })
    .catch((error:any) => {
        console.log(error);
    });
    
    return res.json({
        code: 200,
        status: true, 
        data: rows[0].id>0 ? rows : []
    });
}

async function fetchNote(id:number) {
    let rows:Array<Idata> = [{id:0, title: "", note: "", created_at: ""}];

    await Notes.findAll(
        {
            attributes: ['id', 'title', 'note', 'created_at'],
            where: {id: id},
            raw:true
        },
    )
    .then((row:any) => {
        for(let i in row) {
            row[i].created_at = moment(row[i].created_at).format("YYYY-MM-DD HH:mm:ss");
        }
        rows = row;
    })
    .catch((error:any) => {
        console.log(error);
    });
    
    return rows[0].id>0 ? rows : [];
}