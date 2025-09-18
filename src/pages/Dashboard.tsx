import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameResult } from "../types";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
	const navigate = useNavigate();
	const [results, setResults] = useState<GameResult[]>([]);
	const [loading, setLoading] = useState(false);

	// ローカルストレージから結果を読み込み
	useEffect(() => {
		const savedResults = localStorage.getItem("ginichiro-results");
		if (savedResults) {
			try {
				setResults(JSON.parse(savedResults));
			} catch (error) {
				console.error("Failed to load results from localStorage:", error);
			}
		}
	}, []);

	const handleStartGame = () => {
		navigate("/play");
	};

	const handleDeleteResult = (id: string) => {
		const updatedResults = results.filter((result) => result.id !== id);
		setResults(updatedResults);
		localStorage.setItem("ginichiro-results", JSON.stringify(updatedResults));
	};

	return (
		<div className="center-screen">
			<div className="glass-panel app-content" style={{ width: "100%" }}>
				<header style={{ marginBottom: "1.5rem" }}>
					<h1 className="text-3xl font-bold text-center" style={{ margin: 0 }}>
						🐧 ぎんいちろう福笑いパズル
					</h1>
				</header>

				<main>
					{/* Run Game ボタン */}
					<div className="text-center mb-8">
						<button
							onClick={handleStartGame}
							className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
						>
							🎮 Run Game
						</button>
					</div>

					{/* リザルト一覧 */}
					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-2xl font-bold mb-4 text-gray-800">
							みんなの作品 ({results.length})
						</h2>

						{results.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								<p className="text-lg">まだ作品がありません</p>
								<p>最初の福笑いを作ってみよう！</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{results.map((result) => (
									<div
										key={result.id}
										className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
									>
										{result.imageDataUrl && (
											<img
												src={result.imageDataUrl}
												alt={`${result.character} 福笑い`}
												className="w-full h-48 object-cover rounded-md mb-2"
											/>
										)}
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-600">
												{new Date(result.timestamp).toLocaleDateString("ja-JP")}
											</span>
											<button
												onClick={() =>
													result.id && handleDeleteResult(result.id)
												}
												className="text-red-500 hover:text-red-700 text-sm"
											>
												削除
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</main>

				{/* フッター */}
				<footer
					style={{
						marginTop: "2rem",
						textAlign: "center",
						fontSize: "0.85rem",
						opacity: 0.7,
					}}
				>
					<p style={{ margin: 0 }}>&copy; 2025 ぎんいちろう福笑いパズル</p>
				</footer>
			</div>
		</div>
	);
};

export default Dashboard;
