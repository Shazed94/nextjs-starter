import dynamic from "next/dynamic";

const LoginPage = dynamic(() => import("./LoginPage"), {
  ssr: false,
  loading: () => {
    <>Loading component</>;
  },
});

export default function LoginPageWrapper() {
  return <LoginPage/>;
}
