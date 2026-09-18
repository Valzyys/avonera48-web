import { jkt48, safe } from "@/lib/jkt48";
import { arr } from "@/lib/format";
import { MemberCard, Empty } from "@/components/Cards";
import { MemberFilter } from "@/components/MemberFilter";

export const dynamic = "force-dynamic";
export const metadata = { title: "Member" };

export default async function MembersPage() {
  const { data, error } = await safe(() => jkt48.getMembers());
  const members = arr(data);

  return (
    <div className="shell section">
      <div className="section-head">
        <h1 className="display d2">Member</h1>
        <p className="meta">{members.length} orang</p>
      </div>

      {error ? (
        <Empty>{error}</Empty>
      ) : members.length === 0 ? (
        <Empty>Roster belum kebaca.</Empty>
      ) : (
        <MemberFilter members={members} />
      )}
    </div>
  );
}
