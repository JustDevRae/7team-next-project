import Image from "next/image";
import ic_profile_skeleton from "../../public/ic_profile_skeleton.webp";
import { ProfileCardData } from "@/types/ProfileResponse";

type ProfileCardProps = {
  profileData: ProfileCardData;
  profileImage: string | null;
};

const labels: Record<keyof ProfileCardData, string> = {
  city: "거주 도시",
  mbti: "MBTI",
  job: "직업",
  sns: "SNS 계정",
  birthday: "생일",
  nickname: "별명",
  bloodType: "혈액형",
  nationality: "국적",
};

export default function ProfileCard({ profileData, profileImage }: ProfileCardProps) {
  return (
    <div className="w-80 h-[670px] rounded-xl shadow-lg shadow-gray-300 flex flex-col items-center gap-14 border-none mt-32 px-4">
      <Image className="w-[200px] h-[200px] object-cover rounded-full mt-14" src={profileImage ? profileImage : ic_profile_skeleton} width={200} height={200} alt="프로필이미지" />
      <div className="w-60 h-6 grid grid-cols-[75px_auto] gap-4">
        {Object.entries(profileData).map(([key, value]) => {
          return (
            <>
              <span className="text-sm text-gray-400">{labels[key as keyof ProfileCardData]}</span>
              <span className="text-sm text-gray-800">{value}</span>
            </>
          );
        })}
      </div>
    </div>
  );
}
