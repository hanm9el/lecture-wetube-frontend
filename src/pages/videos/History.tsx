import { useEffect, useState } from "react";
import { fetchHistoryVideos, type Video } from "../../api/video.ts"; // 방금 만든 API 가져오기
import { twMerge } from "tailwind-merge";
import VideoCard from "../../components/video/VideoCard.tsx"; // 영상 카드 컴포넌트 재사용
import { MdHistory } from "react-icons/md"; // 시계 모양 아이콘

function History() {
    // [1] 영상 목록을 저장할 그릇(State)을 만들어요. 처음엔 빈 배열([])이에요.
    const [videos, setVideos] = useState<Video[]>([]);

    // [2] 데이터를 불러오는 중인지 확인할 상태예요. 처음엔 로딩 중(true)이죠.
    const [loading, setLoading] = useState(true);

    // [3] useEffect: 이 페이지가 '짠' 하고 처음 나타날 때 딱 1번 실행되는 함수예요.
    useEffect(() => {
        // 만든 함수(loadVideos)를 실행해요.
        loadVideos().then(() => {});
    }, []);

    // [4] 서버에서 데이터를 진짜로 가져오는 함수예요.
    const loadVideos = async () => {
        try {
            // 아까 만든 fetchHistoryVideos API를 사용해서 데이터를 가져와요.
            const data = await fetchHistoryVideos();
            setVideos(data); // 가져온 데이터를 setVideos를 통해 저장해요.
        } catch (e) {
            console.log(e); // 에러가 나면 콘솔창에 보여줘요.
        } finally {
            // 성공하든 실패하든 로딩은 끝났으니 false로 바꿔요.
            setLoading(false);
        }
    };

    // [5] 로딩 중일 때 화면에 보여줄 모습
    if (loading) return <div className="p-10 text-center">로딩 중...</div>;

    // [6] 시청 기록이 하나도 없을 때 보여줄 모습
    if (videos.length === 0) {
        return (
            <div className={twMerge(["flex", "flex-col", "items-center", "justify-center", "h-[50dvh]"])}>
                <MdHistory className="w-16 h-16 text-text-disabled mb-4" />
                <p className="text-lg text-text-disabled">시청 기록이 없습니다.</p>
            </div>
        );
    }

    // [7] 데이터가 있을 때 화면에 그려주는 부분
    return (
        <div className={twMerge(["p-4", "sm:p-6"])}>
            {/* 페이지 제목 */}
            <h1 className={twMerge(["text-2xl", "font-bold", "mb-6", "flex", "items-center", "gap-3"])}>
                <MdHistory className="text-primary-main" /> 시청 기록
            </h1>

            {/* 영상 카드들을 나열하는 곳 */}
            <div className={twMerge(["flex", "flex-wrap"])}>
                {/* videos 배열을 map으로 돌면서 하나씩 카드로 만들어요 */}
                {videos.map((video) => (
                    <div
                        key={video.id} // 리액트에서 목록을 그릴 땐 고유한 key가 꼭 필요해요.
                        className={twMerge(["w-full", "sm:w-1/2", "md:w-1/3", "lg:w-1/4"], ["px-2", "mb-8"])}
                    >
                        {/* 이미 만들어둔 VideoCard 컴포넌트를 재사용해요! */}
                        <VideoCard video={video} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default History;