import { useState, useLayoutEffect } from "react";
import axios from "axios";
import ListPage from "./components/ListPage";
import INotesdata from "./interfaces/NotesInterface";
import "./App.css";

function App() {
	const [id, setId] = useState<number>(0);
	const [title, setTitle] = useState<string>("");
	const [note, setNote] = useState<string>("");
	const [data, setData] = useState<Array<INotesdata>>([]);
	const [loader, setLoader] = useState<boolean>(false);
	const [msg, setMsg] = useState<string>("");

	const handleSubmit = (e: any) => {
		e.preventDefault();
		if (title === "") {
			alert("Please enter title");
		} else if (note === "") {
			alert("Please enter note");
		} else {
			setLoader(true);
			axios
				.post("http://localhost:4000/add-note", { id: id, title: title, note: note })
				.then((res) => {
					if (res?.data?.code === 200 && res?.data?.data) {
						if (id > 0) {
              console.log(res, res?.data?.data[0].id);
							const currentTodoIndex = data.findIndex((d) => d.id === id);
							const updatedTodo = {
								...data[currentTodoIndex],
								id: res?.data?.data[0].id,
								title: res?.data?.data[0].title,
								note: res?.data?.data[0].note,
								status: res?.data?.data[0].status,
								created_at: res?.data?.data[0].created_at,
								updated_at: res?.data?.data[0].updated_at,
							};
							const newTodos = [...data.slice(0, currentTodoIndex), updatedTodo, ...data.slice(currentTodoIndex + 1)];
							setData(newTodos);
						} else {
							setData([...data, ...res?.data?.data]);
						}
						setMsg(res?.data?.message);
					}
					resetData(0);
					setLoader(false);
				})
				.catch((err) => {
					console.log(err);
					setLoader(false);
				});
		}
	};

	const deleteNote = (row: INotesdata) => {
		setLoader(true);
		resetData();
		axios
			.post("http://localhost:4000/delete-note", { id: row.id })
			.then((res) => {
				console.log(res);
				if (res?.data?.code === 200) {
					setData(data.filter((e) => e !== row));
				}
				setLoader(false);
				setMsg(res?.data?.message);
			})
			.catch((err) => {
				console.log(err);
				setLoader(false);
			});
	};

	const resetData = (msg = 1) => {
		setId(0);
		setTitle("");
		setNote("");
		if (msg) setMsg("");
	};

	const editNote = (row: INotesdata) => {
		resetData();
		setId(row.id);
		setTitle(row.title);
		setNote(row.note);
	};

	useLayoutEffect(() => {
		setLoader(true);
		axios
			.get("http://localhost:4000/get-notes", {})
			.then((res) => {
				if (res?.data?.code === 200 && res?.data?.data) {
					setData(res?.data?.data);
				}
				setLoader(false);
			})
			.catch((err) => {
				console.log(err);
				setLoader(false);
			});
	}, []);

	return (
		<div className="container">
			<div className="loaderContainer" style={{ display: loader ? "block" : "none" }}>
				<img src="/loading.gif" alt="loader" width="100" />
			</div>
			<div className="row">
				<div className="col-sm-4 successMsg">{msg}</div>
			</div>
			<div className="row">
				<div className="col">
					<form method="post" onSubmit={handleSubmit}>
						<input type="hidden" value={id} onChange={(e) => setTitle(e.target.value)} />
						<div className="form-group row">
							<label className="col-sm-2 col-form-label">Title :</label>
							<div className="col-sm-10">
								<input type="text" name="title" id="title" data-testid="title" value={title} onChange={(e) => setTitle(e.target.value)} />
							</div>
						</div>
						<div className="form-group row">
							<label className="col-sm-2 col-form-label">Note :</label>
							<div className="col-sm-10">
								<input type="text" name="note" id="note" data-testid="note" value={note} onChange={(e) => setNote(e.target.value)} />
							</div>
						</div>
						<div className="form-group row">
							<div className="col-sm-3" style={{ textAlign: "right" }}>
								<input type="button" className="btn btn-secondary" name="reset" id="reset" data-testid="reset" value="Reset" onClick={() => resetData()} />
							</div>
							<div className="col-sm-2" style={{ textAlign: "left" }}>
								<input type="submit" className="btn btn-primary" name="sub_btn" id="sub_btn" data-testid="sub_btn" value="Submit" />
							</div>
						</div>
					</form>
				</div>
			</div>
			<ListPage data={data} deleteNote={deleteNote} editNote={editNote} />
		</div>
	);
}

export default App;
