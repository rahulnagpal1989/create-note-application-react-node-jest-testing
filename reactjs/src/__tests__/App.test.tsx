import ReactDOM from "react-dom/client";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("render app component", () => {
    test('test component with axios mock', async () => {
        // Provide the data object to be returned
		mockedAxios.get.mockResolvedValue({
			data: {
                code: 200,
                status: true,
				data: [
					{
						id: 1,
						title: "abc_note1",
						note: "xyz",
						status: 1,
						created_at: "2023-02-23 06:29:04",
                        updated_at: "2023-02-23 06:29:04"
					},
					{
						id: 2,
						title: "abc_note2",
						note: "xyz1",
						status: 1,
						created_at: "2023-02-23 06:29:04",
                        updated_at: "2023-02-23 06:29:04"
					},
				],
			},
		});
        render(<App />);

        await waitFor(() => {
			const textElement = screen.getByText(/abc_note1/);
			expect(textElement).toBeInTheDocument();
		});
    });

    test('test component by inserting note with axios post mock', async () => {
        // Provide the data object to be returned
		mockedAxios.get.mockResolvedValue({
			data: {
                code: 200,
                status: true,
                message: "",
				data: [
					{
						id: 1,
						title: "abc_note1",
						note: "xyz",
						status: 1,
						created_at: "2023-02-23 06:29:04",
                        updated_at: "2023-02-23 06:29:04"
					},
					{
						id: 2,
						title: "abc_note2",
						note: "xyz1",
						status: 1,
						created_at: "2023-02-23 06:29:04",
                        updated_at: "2023-02-23 06:29:04"
					},
				],
			},
		});

        mockedAxios.post.mockResolvedValue({
			data: {
                code: 200,
                status: true,
                message: "",
				data: [
					{
						id: 3,
						title: "new_note1",
						note: "new_xyz",
						status: 1,
						created_at: "2023-02-24 06:29:04",
                        updated_at: "2023-02-24 06:29:04"
					}
				],
			},
		});

        render(<App />);

        await waitFor(() => {
			const inputTitleEl = screen.getByTestId("title");
            userEvent.type(inputTitleEl, "abc");
            expect(screen.getByTestId("title")).toHaveValue("abc");

            const inputNoteEl = screen.getByTestId("note");
            userEvent.type(inputNoteEl, "xyz");
            expect(screen.getByTestId("note")).toHaveValue("xyz");

            // const button = screen.getByTestId('sub_btn');
            // fireEvent.click(button);
		});
    });
});
