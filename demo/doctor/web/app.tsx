import React from "react";
import { useStore } from "./context";
import { Layout, Typography } from "@douyinfe/semi-ui";
import { Summary } from "./components/Summary";

const bgStyle = {
	background: "var(--semi-color-fill-0)"
};
const cardStyle = {
	// background: "rgba(var(--semi-white),1)",
	borderRadius: 9,
	padding: 24
};

export default function App() {
	const {
		state: { data }
	} = useStore();

	return (
		<Layout style={bgStyle}>
			<Layout.Header style={cardStyle}>
				<h1 className="text-3xl font-bold text-gray-800 flex items-center">
					<i className="fas fa-cubes mr-3 text-blue-500"></i>
					WebDoctor
				</h1>
				{/* <Typography.Text type="tertiary" size="small">
					构建时间：{new Date(data.builtAt).toLocaleTimeString()}，构建耗时：
					{data.time}ms
				</Typography.Text> */}
			</Layout.Header>
			<Layout.Content style={{ height: 300, lineHeight: "300px" }}>
				<Summary />
			</Layout.Content>
		</Layout>
	);
}
