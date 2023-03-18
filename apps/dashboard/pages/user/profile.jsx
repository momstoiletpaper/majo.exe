import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { getFlags } from "@majoexe/util/src/functions/getFlags";
import Tippy from "@tippyjs/react";
import { Emojis } from "components/decorations/emojis";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { animateFill } from "tippy.js";
import { Container } from "../../components/blocks/Container";
import { getServers } from "@majoexe/util/src/functions/getServers";
import "tippy.js/dist/backdrop.css";
import "tippy.js/animations/shift-away.css";
import "tippy.js/dist/tippy.css";

export default function Profile({ session, count }) {
 return (
  <Container>
   <div className="flex min-h-screen flex-col justify-center gap-4">
    <h1 className="flex items-center justify-center gap-4 text-center font-inter text-5xl font-bold"></h1>
    <div className="relative md:w-full overflow-hidden rounded-lg bg-[#141f2f]">
     <div
      className="h-[100px] w-full bg-cover bg-center bg-no-repeat"
      style={{
       backgroundColor: "#" + (!session.accent_color ? "5c64f4" : session.accent_color.toString(16)),
       backgroundImage: `url(${session.banner})`,
      }}
     />
     <div className="flex h-[72px] gap-6  w-auto justify-between bg-[#141f2f] p-12 flex-row">
      <div className="mt-[-20px] ml-[-16px] box-content rounded-full flex items-center">
       <Tippy animation="shift-away" hideOnClick={false} duration={400} animateFill={true} plugins={[animateFill]} className="tippy-box" theme="translucent" content={"View avatar"}>
        <Link href={`${session.user.image}?size=2048`} target="_blank" className="w-24 h-24">
         <Image quality={100} src={session.user.image} alt={session.username} width={94} height={94} className="hover:opacity-75 duration-200 rounded-full backdrop-blur-sm !border-4 !border-solid !border-[#141f2f]" />
        </Link>
       </Tippy>
       <div className="flex text-lg items-center font-bold ml-2">
        <div className="text-white">{session.username}</div>
        <div className="text-white/60">#{session.discriminator}</div>
        {session.premium_type > 0 && (
         <Tippy animation="shift-away" hideOnClick={false} duration={400} animateFill={true} plugins={[animateFill]} className="tippy-box" theme="translucent" content={"Nitro"}>
          {Emojis["nitro"]}
         </Tippy>
        )}

        {getFlags(session.public_flags) &&
         getFlags(session.public_flags).map((flag, i) => {
          return (
           <Tippy key={i} animation="shift-away" hideOnClick={false} duration={400} animateFill={true} plugins={[animateFill]} className="tippy-box" theme="translucent" content={flag.content}>
            {Emojis[flag.name]}
           </Tippy>
          );
         })}
       </div>
      </div>
      <div className="mb-[-14px] w-full items-end justify-end font-semibold md:flex hidden">
       <Link href={`https://discord.com/users/${session.id}`} target="_blank" className="flex h-[40px] cursor-pointer items-center rounded bg-button-primary px-4 py-0 font-normal  text-white duration-200 hover:bg-button-primary-hover motion-reduce:transition-none">
        <ArrowTopRightOnSquareIcon className="mr-2 h-4 w-4" aria-hidden="true" role="img" /> See global profile
       </Link>
      </div>
     </div>
     <div className="m-[8px_16px_16px] rounded-lg bg-[#1c293c] p-4">Note: By default your banner and accent color are taken from Discord</div>
    </div>
   </div>
  </Container>
 );
}

export async function getServerSideProps(context) {
 const session = await getSession(context);
 if (!session) return { redirect: { destination: "/auth/login", permanent: false } };

 const servers = (await getServers(session.access_token)) || [];
 const count = servers.length;
 return { props: { session, count } };
}
