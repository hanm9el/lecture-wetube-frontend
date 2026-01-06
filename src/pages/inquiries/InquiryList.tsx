import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge"; // CSS 클래스를 깔끔하게 합쳐주는 도구
import dayjs from "dayjs"; // 날짜를 예쁘게 보여주는 도구
import { fetchInquiries, type Inquiry } from "../../api/inquiry.ts"; // 방금 만든 API 함수
import Button from "../../components/ui/Button.tsx"; // 우리가 만든 버튼 컴포넌트

function InquiryList() {
    const navigate = useNavigate(); // 페이지 이동을 도와주는 함수

    // 서버에서 가져온 문의글 목록을 저장할 공간 (초기값은 빈 배열 [])
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);

    // 데이터를 불러오는 중인지 체크하는 상태 (초기값은 true = 로딩중)
    const [loading, setLoading] = useState(true);

    // useEffect: 이 컴포넌트(페이지)가 화면에 처음 나타날 때 딱 1번 실행됩니다.
    useEffect(() => {
        // 서버에서 데이터를 가져오는 함수를 실행합니다.
        loadInquiries().then(() => {});
    }, []);

    const loadInquiries = async () => {
        try {
            const result = await fetchInquiries();
            console.log("서버에서 온 데이터:", result);
            setInquiries(result.inquiries || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={twMerge(["w-full", "max-w-4xl", "mx-auto", "px-4"])}>
            {/* 페이지 제목과 글쓰기 버튼 영역 */}
            <div className={twMerge(["flex", "justify-between", "items-center", "mb-6"])}>
                <h1 className={twMerge(["text-2xl", "font-bold"])}>1:1 문의</h1>
                {/* 버튼을 누르면 /inquiries/create 페이지로 이동합니다 */}
                <Button onClick={() => navigate("/inquiries/new")}>문의하기</Button>
            </div>

            {/* 게시판 목록 영역 */}
            <div className={twMerge(["bg-background-paper", "border", "border-divider", "rounded-lg"])}>
                {/* 1. 헤더 (맨 윗줄: 번호, 제목, 상태, 날짜) */}
                <table className={twMerge(["w-full"])}>
                    <thead className={twMerge(["border-b", "border-divider"])}>
                        <tr>
                            <th
                                className={twMerge(
                                    ["w-[10%]", "min-w-20", "px-6", "py-3"],
                                    ["text-sm", "font-medium"],
                                )}
                            >
                                상태
                            </th>
                            <th className={twMerge(["w-[70%]", "px-6", "py-3"], ["text-sm", "font-medium"])}>
                                제목
                            </th>
                            <th
                                className={twMerge(
                                    ["w-[20%]", "min-w-25", "px-6", "py-3"],
                                    ["text-sm", "font-medium"],
                                )}
                            >
                                날짜
                            </th>
                        </tr>
                    </thead>
                    {/* divide-y 클래스 : 내부에 들어가는 요소의 y축 사이에 보더를 쳐줌 */}
                    <tbody className={twMerge(["divide-y", "divide-divider"])}>
                        {loading ? (
                            <tr>
                                <td colSpan={3} className={twMerge(["p-8", "text-center"])}>
                                    로딩 중...
                                </td>
                            </tr>
                        ) : inquiries.length === 0 ? (
                            <tr>
                                <td colSpan={3} className={twMerge(["p-8", "text-center"])}>
                                    문의 내역이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            inquiries.map((inquiry) => (
                                <tr
                                    key={inquiry.id}
                                    className={twMerge([
                                        "hover:bg-text-disabled/10",
                                        "transition-colors",
                                    ])}
                                >
                                    <td className={twMerge(["px-6", "py-4"])}>
                                        <span
                                            className={twMerge(
                                                [
                                                    "px-2",
                                                    "py-1",
                                                    "text-xs",
                                                    "rounded-full",
                                                    "whitespace-nowrap",
                                                ],
                                                inquiry.isAnswered
                                                    ? ["bg-success-main/10", "text-success-main"]
                                                    : ["bg-text-disabled/30", "text-text-disabled"],
                                            )}
                                        >
                                            {inquiry.isAnswered ? "답변완료" : "답변대기"}
                                        </span>
                                    </td>
                                    <td className={twMerge(["px-6", "py-4"])}>
                                        <Link to={`/inquiries/${inquiry.id}`}>{inquiry.title}</Link>
                                    </td>
                                    <td className={twMerge(["px-6", "py-4"])}>
                                        {dayjs(inquiry.createdAt).format("YYYY.MM.DD")}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InquiryList;
