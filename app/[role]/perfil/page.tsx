"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { ZxPage } from "@/components/shared/zx-page";
import { useDemoGuard } from "@/lib/demo-session";
import {
  CURRENT_GUARDIAN_ID,
  CURRENT_STAFF_ID,
  CURRENT_STUDENT_ID,
  getClass,
  getClassesOfStaff,
  getStudent,
  getStudentsOfGuardian,
  initialsOf,
  PROFILE_KEY_PREFIX,
  profileDefaults,
  staff,
  type AreaRole,
  type ProfileData,
} from "@/data/shared/school";

const areas: AreaRole[] = ["aluno", "responsavel", "funcionario", "direcao", "admin"];
const roleLabel: Record<AreaRole, string> = {
  aluno: "Aluno",
  responsavel: "Responsável",
  funcionario: "Professor / Funcionário",
  direcao: "Direção / Coordenação",
  admin: "Administração (TI)",
};

export default function PerfilPage() {
  const { role } = useParams<{ role: string }>();
  const authorized = useDemoGuard(role, areas);
  const area = (areas.includes(role as AreaRole) ? role : "aluno") as AreaRole;
  const [profile, setProfile] = useState<ProfileData>(profileDefaults[area]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY_PREFIX + area);
      if (saved) setProfile({ ...profileDefaults[area], ...JSON.parse(saved) });
    } catch {
      /* sem armazenamento disponível: mantém os dados padrão */
    }
  }, [area]);

  if (!authorized) return null;

  const update = (field: keyof ProfileData, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const onPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({ ...current, photo: "Escolha um arquivo de imagem." }));
      return;
    }
    if (file.size > 1_500_000) {
      setErrors((current) => ({ ...current, photo: "A imagem deve ter no máximo 1,5 MB." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setErrors((current) => ({ ...current, photo: "" }));
      update("photo", String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (profile.name.trim().length < 3) next.name = "Informe o nome completo.";
    if (!/^\S+@\S+\.\S+$/.test(profile.email.trim())) next.email = "Informe um e-mail válido.";
    if (profile.phone.trim() && profile.phone.replace(/\D/g, "").length < 10)
      next.phone = "Informe o telefone com DDD.";
    if (profile.bio.length > 240) next.bio = "A apresentação deve ter no máximo 240 caracteres.";
    return next;
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setMessage("");
      return;
    }
    try {
      localStorage.setItem(PROFILE_KEY_PREFIX + area, JSON.stringify(profile));
      setMessage("Perfil atualizado! (dados de demonstração, salvos apenas neste navegador)");
    } catch {
      setMessage("Não foi possível salvar neste navegador.");
    }
  };

  const reset = () => {
    try {
      localStorage.removeItem(PROFILE_KEY_PREFIX + area);
    } catch {
      /* ignora */
    }
    setProfile(profileDefaults[area]);
    setErrors({});
    setMessage("Dados originais restaurados.");
  };

  // Informações institucionais (somente leitura), conforme o perfil.
  const student = getStudent(CURRENT_STUDENT_ID);
  const readOnly: [string, string][] =
    area === "aluno" && student
      ? [
          ["Registro acadêmico (RA)", student.ra],
          ["Turma", getClass(student.classId)?.name ?? ""],
        ]
      : area === "responsavel"
        ? [
            [
              "Alunos vinculados",
              getStudentsOfGuardian(CURRENT_GUARDIAN_ID)
                .map((item) => `${item.name} (${getClass(item.classId)?.name})`)
                .join(", "),
            ],
          ]
        : area === "funcionario"
          ? [
              ["Cargo", staff.find((item) => item.id === CURRENT_STAFF_ID)?.position ?? ""],
              ["Turmas", getClassesOfStaff(CURRENT_STAFF_ID).map((item) => item.name).join(", ")],
            ]
          : [["Nível de acesso", "Administrador (acesso total)"]];

  return (
    <ZxPage
      role={role}
      eyebrow={roleLabel[area].toUpperCase()}
      title="Meu perfil"
      subtitle="Revise e atualize seus dados de contato e sua apresentação."
    >
      <form className="zx-form" onSubmit={submit} noValidate>
        <div className="zx-photo">
          <div className="zx-photo-circle">
            {profile.photo ? <img src={profile.photo} alt="Foto de perfil" /> : initialsOf(profile.name)}
          </div>
          <div>
            <label className="outline-button" htmlFor="profile-photo">
              Alterar foto
            </label>
            <input id="profile-photo" type="file" accept="image/*" className="invisible" onChange={onPhoto} />
            {profile.photo && (
              <button type="button" className="outline-button" onClick={() => update("photo", "")}>
                Remover
              </button>
            )}
            {errors.photo && <p className="zx-error">{errors.photo}</p>}
          </div>
        </div>

        <label htmlFor="profile-name">Nome completo</label>
        <input id="profile-name" value={profile.name} onChange={(e) => update("name", e.target.value)} />
        {errors.name && <p className="zx-error">{errors.name}</p>}

        <label htmlFor="profile-email">E-mail</label>
        <input id="profile-email" type="email" value={profile.email} onChange={(e) => update("email", e.target.value)} />
        {errors.email && <p className="zx-error">{errors.email}</p>}

        <label htmlFor="profile-phone">Telefone</label>
        <input id="profile-phone" value={profile.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(00) 00000-0000" />
        {errors.phone && <p className="zx-error">{errors.phone}</p>}

        <label htmlFor="profile-bio">Apresentação</label>
        <textarea id="profile-bio" value={profile.bio} onChange={(e) => update("bio", e.target.value)} />
        {errors.bio && <p className="zx-error">{errors.bio}</p>}

        {(area === "aluno" || area === "funcionario") && (
          <>
            <label htmlFor="profile-interests">Interesses (separados por vírgula)</label>
            <input id="profile-interests" value={profile.interests} onChange={(e) => update("interests", e.target.value)} />
          </>
        )}

        {readOnly.map(([label, value]) => (
          <div key={label} style={{ display: "grid", gap: 6 }}>
            <label>{label}</label>
            <input value={value} readOnly aria-label={label} />
          </div>
        ))}

        <div className="zx-actions">
          <button type="submit" className="primary-button">
            Salvar alterações
          </button>
          <button type="button" className="outline-button" onClick={reset}>
            Restaurar dados originais
          </button>
        </div>
        {message && (
          <p className="zx-success" role="status">
            {message}
          </p>
        )}
      </form>
    </ZxPage>
  );
}
