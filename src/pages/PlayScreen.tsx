import React, { useState, useRef } from "react";

// パーツの配置順序（ディレクトリ構造に合わせて更新）
const PLACEMENT_ORDER = [
	"head",
	"body",
	"beak",
	"left_eye",
	"right_eye",
	"left_eyebrow",
	"right_eyebrow",
	"left_arm",
	"right_arm",
	"left_foot",
	"right_foot",
	"muffler",
	"school_symbol",
];

interface PartPosition {
	x: number;
	y: number;
	placed: boolean;
}

const PlayScreen: React.FC = () => {
	const [gamePhase, setGamePhase] = useState<
		"character-select" | "playing" | "result"
	>("character-select");
	const [currentPartIndex, setCurrentPartIndex] = useState(0);
	const [partPositions, setPartPositions] = useState<
		Record<string, PartPosition>
	>({});
	const [draggedPart, setDraggedPart] = useState<string | null>(null);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const canvasRef = useRef<HTMLDivElement>(null);

	const handleBackToDashboard = () => {
		window.location.href = "/";
	};

	const handleStartGame = () => {
		setGamePhase("playing");
		setCurrentPartIndex(0);
		setPartPositions({});
	};

	const handleRestart = () => {
		setGamePhase("character-select");
		setCurrentPartIndex(0);
		setPartPositions({});
	};

	const handleNextPart = () => {
		if (currentPartIndex < PLACEMENT_ORDER.length - 1) {
			setCurrentPartIndex(currentPartIndex + 1);
		} else {
			setGamePhase("result");
		}
	};

	// ドラッグ開始
	const handleDragStart = (e: React.DragEvent, partName: string) => {
		setDraggedPart(partName);
		const rect = e.currentTarget.getBoundingClientRect();
		setDragOffset({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};

	// ドラッグオーバー（ドロップ許可）
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	// ドロップ処理
	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		if (!draggedPart || !canvasRef.current) return;

		const canvasRect = canvasRef.current.getBoundingClientRect();
		const x = e.clientX - canvasRect.left - dragOffset.x;
		const y = e.clientY - canvasRect.top - dragOffset.y;

		setPartPositions((prev) => ({
			...prev,
			[draggedPart]: {
				x: Math.max(0, Math.min(x, canvasRect.width - 200)), // 境界チェック
				y: Math.max(0, Math.min(y, canvasRect.height - 200)),
				placed: true,
			},
		}));

		setDraggedPart(null);

		// 現在のパーツが配置されたら自動的に次へ進む
		if (draggedPart === PLACEMENT_ORDER[currentPartIndex]) {
			setTimeout(() => handleNextPart(), 500);
		}
	};

	const currentPart = PLACEMENT_ORDER[currentPartIndex];
	const isCurrentPartPlaced = partPositions[currentPart]?.placed || false;

	// キャラクター選択画面
	if (gamePhase === "character-select") {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 flex items-center justify-center p-4">
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full">
					<h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
						キャラクター選択
					</h2>
					<div className="mb-6">
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors cursor-pointer text-center bg-gray-50">
							<img
								src="/images/ginichiro/ginichiro.png"
								alt="ぎんいちろう完成形"
								className="w-32 h-32 mx-auto mb-4 object-contain"
							/>
							<h3 className="text-xl font-bold text-gray-800">ぎんいちろう</h3>
							<p className="text-sm text-gray-600">熊本高専のマスコット</p>
						</div>
					</div>
					<div className="flex justify-between">
						<button
							onClick={handleBackToDashboard}
							className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
						>
							← 戻る
						</button>
						<button
							onClick={handleStartGame}
							className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
						>
							🎮 Start
						</button>
					</div>
				</div>
			</div>
		);
	}

	// 結果表示画面
	if (gamePhase === "result") {
		return (
			<div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
					<h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
						🎉 完成！
					</h1>
					<h2 className="text-xl font-bold mb-6 text-center text-gray-600">
						あなたの作品
					</h2>

					{/* 完成した福笑いを表示 */}
					<div className="relative w-96 h-96 mx-auto bg-gradient-to-br from-blue-50 to-yellow-50 rounded-lg border-2 border-gray-200 mb-6">
						{/* 背景画像 */}
						<img
							src="/images/backgrounds/play/blackboard_1.jpg"
							alt="背景"
							className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-30"
							onError={(e) => {
								e.currentTarget.style.display = "none";
							}}
						/>

						{/* 配置されたパーツを表示（可視化） */}
						{PLACEMENT_ORDER.map((partName) => {
							const position = partPositions[partName];
							if (!position?.placed) return null;
							console.log("partName", partName);
							return (
								<img
									key={partName}
									src={`/images/ginichiro/ginichiro_parts/${partName}.jpg`}
									alt={partName}
									className="absolute w-64 h-64"
									width="1024"
									style={{
										left: `${position.x}px`,
										top: `${position.y}px`,
										objectFit: "contain",
										backgroundColor: "transparent",
										mixBlendMode: "multiply",
									}}
									onError={(e) => {
										console.warn(`画像が見つかりません: ${partName}`);
										e.currentTarget.style.display = "none";
									}}
								/>
							);
						})}
					</div>

					<div className="flex gap-4 justify-center">
						<button
							onClick={handleRestart}
							className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-colors"
						>
							🔄 もう一度
						</button>
						<button
							onClick={handleBackToDashboard}
							className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
						>
							💾 保存して戻る
						</button>
					</div>
				</div>
			</div>
		);
	}

	// ゲームプレイ画面
	return (
		<div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-4">
			<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-7xl mx-auto">
				<header className="mb-6 flex justify-between items-center flex-wrap gap-4">
					<h1 className="text-2xl font-bold text-gray-800">
						🐧 ぎんいちろう福笑い
					</h1>
					<div className="flex items-center gap-4">
						<span className="text-sm font-medium bg-blue-100 px-3 py-1 rounded-full">
							{currentPartIndex + 1} / {PLACEMENT_ORDER.length}
						</span>
						<div className="flex gap-2">
							<button
								onClick={handleRestart}
								className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm transition-colors"
							>
								🔄 やり直し
							</button>
							<button
								onClick={handleBackToDashboard}
								className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors"
							>
								← 戻る
							</button>
						</div>
					</div>
				</header>

				<main>
					{/* 現在のパーツ表示 */}
					<div className="text-center mb-6">
						<h2 className="text-lg font-bold text-gray-700">
							現在のパーツ: <span className="text-red-600">{currentPart}</span>
						</h2>
						{isCurrentPartPlaced && (
							<p className="text-green-600 text-sm mt-1">
								✅ 配置完了！次のパーツに進みます...
							</p>
						)}
					</div>

					<div className="flex gap-6">
						{/* 左側: パーツプレビューと進行状況 */}
						<div className="w-80">
							{/* 現在のパーツ */}
							<div className="bg-white rounded-lg shadow-lg p-6 mb-4">
								<h3 className="text-lg font-bold mb-4 text-center text-gray-800">
									配置するパーツ
								</h3>

								<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
									<img
										src={`/images/ginichiro/ginichiro_parts/${currentPart}.jpg`}
										alt={currentPart}
										className="w-32 h-32 mx-auto mb-3 object-contain cursor-move"
										draggable
										onDragStart={(e) => handleDragStart(e, currentPart)}
										onError={(e) => {
											console.warn(`画像が見つかりません: ${currentPart}`);
											e.currentTarget.style.display = "none";
										}}
									/>
									<div className="text-sm font-medium text-gray-700">
										{currentPart}
									</div>
									<div className="text-xs text-gray-500 mt-1">
										ドラッグしてキャンバスに配置
									</div>
								</div>
							</div>

							{/* 進行状況 */}
							<div className="bg-white rounded-lg shadow-lg p-4">
								<h4 className="text-sm font-bold mb-3 text-gray-800">
									進行状況
								</h4>
								<div className="space-y-2">
									{PLACEMENT_ORDER.map((part, index) => (
										<div key={part} className="flex items-center text-sm">
											<div
												className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center text-xs ${
													partPositions[part]?.placed
														? "bg-green-500 text-white"
														: index === currentPartIndex
														  ? "bg-yellow-400 text-gray-800"
														  : "bg-gray-300"
												}`}
											>
												{partPositions[part]?.placed ? "✓" : index + 1}
											</div>
											<span
												className={
													index === currentPartIndex
														? "font-bold text-blue-600"
														: "text-gray-600"
												}
											>
												{part}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* 右側: キャンバスエリア */}
						<div className="flex-1">
							<div className="bg-white rounded-lg shadow-lg p-6">
								<h3 className="text-lg font-bold mb-4 text-gray-800">
									キャンバス
								</h3>

								<div
									ref={canvasRef}
									className="relative bg-gradient-to-br from-blue-50 to-yellow-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden"
									style={{ height: "600px", width: "100%" }}
									onDragOver={handleDragOver}
									onDrop={handleDrop}
								>
									{/* 背景ガイド */}
									<img
										src="/images/backgrounds/play/blackboard_1.jpg"
										alt="背景ガイド"
										className="absolute inset-0 w-full h-full object-contain opacity-20"
										onError={(e) => {
											e.currentTarget.style.display = "none";
										}}
									/>

									{/* 配置されたパーツを表示（不可視状態） */}
									{PLACEMENT_ORDER.map((partName) => {
										const position = partPositions[partName];
										if (!position?.placed) return null;

										return (
											<div
												key={partName}
												className="absolute w-64 h-64 bg-gray-200 border border-gray-400 rounded opacity-30 flex items-center justify-center"
												style={{
													left: `${position.x}px`,
													top: `${position.y}px`,
												}}
											>
												<span className="text-sm text-gray-600">
													{partName}
												</span>
											</div>
										);
									})}

									{/* ドロップエリアのメッセージ */}
									{Object.keys(partPositions).length === 0 && (
										<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
											<div className="text-center text-gray-500">
												<div className="text-4xl mb-3">🎯</div>
												<div className="text-lg font-medium">
													パーツをここにドロップしよう！
												</div>
												<div className="text-sm mt-2">
													左側のパーツをドラッグ&ドロップで配置してください
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default PlayScreen;
