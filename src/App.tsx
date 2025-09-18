// App.tsx
import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PlayScreen from "./pages/PlayScreen";
import "./App.css";

const background = "./images/backgrounds/commons/blackboard_1.jpg";

const App: React.FC = () => {
	return (
		<Router>
			<div
				className="background-full"
				style={{
					backgroundImage: `url(${background})`,
				}}
			>
				<div className="App">
					<Routes>
						{/* ダッシュボード（トップページ） */}
						<Route path="/" element={<Dashboard />} />
						{/* ゲーム画面 */}
						<Route path="play" element={<PlayScreen />} />

						{/* 404などの場合はダッシュボードにリダイレクト */}
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
};

export default App;
