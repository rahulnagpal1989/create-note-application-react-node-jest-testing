import INotesdata from "../interfaces/NotesInterface";

interface IProps {
	data: Array<INotesdata>;
	deleteNote: Function;
    editNote: Function;
}

export default function ListPage(props: IProps) {
	return (
		<>
			<table className="table">
				<thead className="thead-dark">
					<tr>
						<th scope="col">#</th>
						<th scope="col">Title</th>
						<th scope="col">Note</th>
						<th scope="col">Created Date</th>
						<th scope="col">Delete</th>
					</tr>
				</thead>
				<tbody>
					{props &&
						props.data &&
						props.data.length > 0 &&
						props.data.map((data, index) => (
							<tr key={index}>
								<th scope="row">{data.id}</th>
								<td>{data.title}</td>
								<td>{data.note}</td>
								<td>{data.created_at}</td>
								<td>
									<a href="#" onClick={() => props.editNote(data)}>
										Edit
									</a> |&nbsp;
									<a href="#" onClick={() => props.deleteNote(data)}>
										Delete
									</a>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</>
	);
}
