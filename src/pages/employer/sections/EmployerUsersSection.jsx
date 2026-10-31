import EmployerTeam from "../EmployerTeam";

export default function EmployerUsersSection({
    setToast,
}) {
    return (
        <EmployerTeam onToast={setToast} />
    );
}
