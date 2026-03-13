import { useState } from "react";
import { useMe } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Edit2, Upload, Download, User as UserIcon, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";

/* ─── Types ─────────────────────────────────────────────── */
interface BasicDetails { employeeId: string; firstName: string; lastName: string; dateOfJoining: string; nationality: string; dateOfBirth: string; maritalStatus: string; religion: string; }
interface ContactInfo { officialEmail: string; mobileNumber: string; personalEmail: string; emergencyContact: string; }
interface AddressDetails { address: string; city: string; state: string; pinCode: string; country: string; workLocation: string; }
interface BankingDetails { bankName: string; accountNumber: string; accountType: string; ifscCode: string; swiftCode: string; branchName: string; }
interface IdentificationDocs { nationalIdType: string; nationalIdNumber: string; }
interface PassportDetails { hasPassport: string; passportNumber: string; passportExpiry: string; }
interface InsuranceDetails { policyNumber: string; memberId: string; policyStartDate: string; policyEndDate: string; }
interface EducationalDocs { highestEducation: string; }
interface FamilyInfo { spouseName: string; spouseRole: string; spouseOrg: string; numberOfChildren: string; }

/* ─── Reusable sub-components ───────────────────────────── */
function CardHeader({ title, section, editing, onEdit }: { title: string; section: string; editing: string | null; onEdit: (s: string) => void; }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      {editing !== section && (
        <button onClick={() => onEdit(section)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title={`Edit ${title}`}>
          <Edit2 className="w-4 h-4 text-slate-500" />
        </button>
      )}
    </div>
  );
}

function SaveCancel({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex gap-2 pt-2">
      <button onClick={onSave} className="flex-1 bg-blue-700 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors">Save</button>
      <button onClick={onCancel} className="flex-1 border border-slate-300 text-slate-600 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs text-slate-500 flex-shrink-0 w-36">{label}</span>
      <span className="text-xs font-semibold text-slate-800 text-right break-all">{value || "—"}</span>
    </div>
  );
}

function FieldGrid({ pairs }: { pairs: [string, string][] }) {
  return (
    <div className="space-y-3">
      {pairs.map(([label, value]) => <FieldRow key={label} label={label} value={value} />)}
    </div>
  );
}

function EditField({ label, field, draft, setDraft }: { label: string; field: string; draft: Record<string, string>; setDraft: (v: Record<string, string>) => void }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 block mb-1">{label}</label>
      <Input value={draft[field] ?? ""} onChange={e => setDraft({ ...draft, [field]: e.target.value })} className="text-xs h-8" />
    </div>
  );
}

function UploadField({ label }: { label: string }) {
  const [fileName, setFileName] = useState<string | null>(null);
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 block mb-1">{label}</label>
      <label className="flex items-center gap-3 border-2 border-dashed border-slate-200 rounded-xl p-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors group">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 flex-shrink-0">
          <Upload className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-700 truncate">{fileName ?? "Click to upload"}</p>
          <p className="text-xs text-slate-400">PDF, JPG, PNG</p>
        </div>
        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFileName(e.target.files?.[0]?.name ?? null)} />
      </label>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────── */
export default function Profile() {
  const { data: user, isLoading } = useMe();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  /* Left column state */
  const [basicDetails, setBasicDetails] = useState<BasicDetails>({ employeeId: "EMP-2024-001", firstName: "Durgha", lastName: "S", dateOfJoining: "2024-01-15", nationality: "Indian", dateOfBirth: "1998-06-20", maritalStatus: "Single", religion: "Hindu" });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ officialEmail: "durgha.s@company.com", mobileNumber: "+91 98765 43210", personalEmail: "durgha.s@gmail.com", emergencyContact: "+91 91234 56789" });
  const [basicDraft, setBasicDraft] = useState<Record<string, string>>({ ...basicDetails });
  const [contactDraft, setContactDraft] = useState<Record<string, string>>({ ...contactInfo });

  /* Right column state */
  const [about, setAbout] = useState("Passionate AI Developer with hands-on experience in machine learning, NLP, and building intelligent applications. Quick learner with a collaborative mindset.");
  const [aboutDraft, setAboutDraft] = useState(about);

  const [skills, setSkills] = useState(["Python", "Machine Learning", "React", "Node.js", "TensorFlow"]);
  const [newSkill, setNewSkill] = useState("");

  const [addressDetails, setAddressDetails] = useState<AddressDetails>({ address: "12, Anna Nagar", city: "Chennai", state: "Tamil Nadu", pinCode: "600040", country: "India", workLocation: "Chennai HQ" });
  const [addressDraft, setAddressDraft] = useState<Record<string, string>>({ ...addressDetails });

  const [bankingDetails] = useState<BankingDetails>({ bankName: "State Bank of India", accountNumber: "XXXX XXXX 4567", accountType: "Savings", ifscCode: "SBIN0001234", swiftCode: "SBININBB", branchName: "Anna Nagar Branch" });

  const [identificationDocs, setIdentificationDocs] = useState<IdentificationDocs>({ nationalIdType: "Aadhaar Card", nationalIdNumber: "XXXX-XXXX-4321" });
  const [identificationDraft, setIdentificationDraft] = useState<Record<string, string>>({ ...identificationDocs });

  const [passportDetails, setPassportDetails] = useState<PassportDetails>({ hasPassport: "Yes", passportNumber: "J1234567", passportExpiry: "2030-05-15" });
  const [passportDraft, setPassportDraft] = useState<Record<string, string>>({ ...passportDetails });

  const [insuranceDetails, setInsuranceDetails] = useState<InsuranceDetails>({ policyNumber: "POL-2024-789", memberId: "MEM-456", policyStartDate: "2024-01-01", policyEndDate: "2024-12-31" });
  const [insuranceDraft, setInsuranceDraft] = useState<Record<string, string>>({ ...insuranceDetails });

  const [educationalDocs, setEducationalDocs] = useState<EducationalDocs>({ highestEducation: "Bachelor of Technology (B.Tech)" });
  const [educationalDraft, setEducationalDraft] = useState<Record<string, string>>({ ...educationalDocs });

  const [familyInfo, setFamilyInfo] = useState<FamilyInfo>({ spouseName: "", spouseRole: "", spouseOrg: "", numberOfChildren: "0" });
  const [familyDraft, setFamilyDraft] = useState<Record<string, string>>({ ...familyInfo });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;
  if (!user) return <Redirect to="/" />;

  const startEdit = (section: string, draft?: Record<string, string>) => {
    if (draft) {
      if (section === "basic") setBasicDraft({ ...basicDetails });
      if (section === "contact") setContactDraft({ ...contactInfo });
      if (section === "address") setAddressDraft({ ...addressDetails });
      if (section === "identification") setIdentificationDraft({ ...identificationDocs });
      if (section === "passport") setPassportDraft({ ...passportDetails });
      if (section === "insurance") setInsuranceDraft({ ...insuranceDetails });
      if (section === "educational") setEducationalDraft({ ...educationalDocs });
      if (section === "family") setFamilyDraft({ ...familyInfo });
    }
    if (section === "about") setAboutDraft(about);
    setEditingSection(section);
  };

  const saveSection = (section: string) => {
    if (section === "basic") setBasicDetails(basicDraft as unknown as BasicDetails);
    if (section === "contact") setContactInfo(contactDraft as unknown as ContactInfo);
    if (section === "about") setAbout(aboutDraft);
    if (section === "address") setAddressDetails(addressDraft as unknown as AddressDetails);
    if (section === "identification") setIdentificationDocs(identificationDraft as unknown as IdentificationDocs);
    if (section === "passport") setPassportDetails(passportDraft as unknown as PassportDetails);
    if (section === "insurance") setInsuranceDetails(insuranceDraft as unknown as InsuranceDetails);
    if (section === "educational") setEducationalDocs(educationalDraft as unknown as EducationalDocs);
    if (section === "family") setFamilyInfo(familyDraft as unknown as FamilyInfo);
    setEditingSection(null);
  };

  const cancelEdit = () => setEditingSection(null);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="flex gap-6 max-w-6xl">

        {/* ── Left Column ─────────────────────────────────── */}
        <div className="flex flex-col gap-6 w-80 flex-shrink-0">

          {/* 1. Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-24 w-full" style={{ background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)" }} />
            <div className="flex flex-col items-center -mt-12 pb-6 px-6">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center shadow-md overflow-hidden">
                {user.profileImage ? <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" /> : <UserIcon className="w-10 h-10 text-slate-400" />}
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-3">Durgha S</h2>
              <span className="mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: "#1e40af" }}>AI - Developer</span>
            </div>
          </div>

          {/* 2. Resume Card */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Resume</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100"><Upload className="w-4 h-4 text-blue-600" /></div>
                <div><p className="text-sm font-medium text-slate-700">Upload Resume</p><p className="text-xs text-slate-400">PDF, DOC up to 5MB</p></div>
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
              </label>
              <button className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200"><Download className="w-4 h-4 text-slate-600" /></div>
                <div className="text-left"><p className="text-sm font-medium text-slate-700">Download Resume</p><p className="text-xs text-slate-400">Download current resume</p></div>
              </button>
            </div>
          </div>

          {/* 3. Basic Details Card */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <CardHeader title="Basic Details" section="basic" editing={editingSection} onEdit={() => startEdit("basic", {})} />
            {editingSection === "basic" ? (
              <div className="space-y-3">
                {(["employeeId","firstName","lastName","dateOfJoining","nationality","dateOfBirth","maritalStatus","religion"] as (keyof BasicDetails)[]).map(f => (
                  <EditField key={f} label={f.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase())} field={f} draft={basicDraft} setDraft={setBasicDraft} />
                ))}
                <SaveCancel onSave={() => saveSection("basic")} onCancel={cancelEdit} />
              </div>
            ) : (
              <FieldGrid pairs={[["Employee ID",basicDetails.employeeId],["First Name",basicDetails.firstName],["Last Name",basicDetails.lastName],["Date of Joining",basicDetails.dateOfJoining],["Nationality",basicDetails.nationality],["Date of Birth",basicDetails.dateOfBirth],["Marital Status",basicDetails.maritalStatus],["Religion",basicDetails.religion]]} />
            )}
          </div>

          {/* 4. Contact Information Card */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <CardHeader title="Contact Information" section="contact" editing={editingSection} onEdit={() => startEdit("contact", {})} />
            {editingSection === "contact" ? (
              <div className="space-y-3">
                {(["officialEmail","mobileNumber","personalEmail","emergencyContact"] as (keyof ContactInfo)[]).map(f => (
                  <EditField key={f} label={f.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase())} field={f} draft={contactDraft} setDraft={setContactDraft} />
                ))}
                <SaveCancel onSave={() => saveSection("contact")} onCancel={cancelEdit} />
              </div>
            ) : (
              <FieldGrid pairs={[["Official Email ID",contactInfo.officialEmail],["Mobile Number",contactInfo.mobileNumber],["Personal Email ID",contactInfo.personalEmail],["Emergency Contact",contactInfo.emergencyContact]]} />
            )}
          </div>

        </div>

        {/* ── Right Column ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">

          {/* 1. About Employee */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <CardHeader title="About Employee" section="about" editing={editingSection} onEdit={() => startEdit("about")} />
            {editingSection === "about" ? (
              <div className="space-y-3">
                <textarea value={aboutDraft} onChange={e => setAboutDraft(e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                <SaveCancel onSave={() => saveSection("about")} onCancel={cancelEdit} />
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">{about || "No description added yet."}</p>
            )}
          </div>

          {/* 2. Skills & Expertise */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Skills &amp; Expertise</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map(skill => (
                <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                  {skill}
                  <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} placeholder="Add a skill..." className="text-xs h-8 flex-1" />
              <button onClick={addSkill} className="flex items-center gap-1 px-3 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* 3. Address Details */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <CardHeader title="Address Details" section="address" editing={editingSection} onEdit={() => startEdit("address", {})} />
            {editingSection === "address" ? (
              <div className="grid grid-cols-2 gap-3">
                {(["address","city","state","pinCode","country","workLocation"] as (keyof AddressDetails)[]).map(f => (
                  <div key={f} className={f === "address" ? "col-span-2" : ""}>
                    <EditField label={f.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase())} field={f} draft={addressDraft} setDraft={setAddressDraft} />
                  </div>
                ))}
                <div className="col-span-2"><SaveCancel onSave={() => saveSection("address")} onCancel={cancelEdit} /></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {([ ["Address",addressDetails.address],["City",addressDetails.city],["State",addressDetails.state],["Pin Code",addressDetails.pinCode],["Country",addressDetails.country],["Work Location",addressDetails.workLocation] ] as [string,string][]).map(([label,value]) => (
                  <div key={label}>
                    <span className="text-xs text-slate-500 block mb-0.5">{label}</span>
                    <span className="text-xs font-semibold text-slate-800">{value || "—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Banking Details */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Banking Details</h3>
              <Edit2 className="w-4 h-4 text-slate-300" title="Managed by HR" />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {([ ["Bank Name",bankingDetails.bankName],["Account Number",bankingDetails.accountNumber],["Account Type",bankingDetails.accountType],["IFSC Code",bankingDetails.ifscCode],["SWIFT Code",bankingDetails.swiftCode],["Branch Name",bankingDetails.branchName] ] as [string,string][]).map(([label,value]) => (
                <div key={label}>
                  <span className="text-xs text-slate-500 block mb-0.5">{label}</span>
                  <span className="text-xs font-semibold text-slate-800">{value || "—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Identification Documents */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <CardHeader title="Identification Documents" section="identification" editing={editingSection} onEdit={() => startEdit("identification", {})} />
            {editingSection === "identification" ? (
              <div className="space-y-3">
                <EditField label="National Identity Card Type" field="nationalIdType" draft={identificationDraft} setDraft={setIdentificationDraft} />
                <EditField label="National Identity Number" field="nationalIdNumber" draft={identificationDraft} setDraft={setIdentificationDraft} />
                <SaveCancel onSave={() => saveSection("identification")} onCancel={cancelEdit} />
              </div>
            ) : (
              <div className="space-y-4">
                <FieldGrid pairs={[["ID Card Type", identificationDocs.nationalIdType], ["National ID Number", identificationDocs.nationalIdNumber]]} />
                <UploadField label="National ID Upload" />
              </div>
            )}
          </div>

          {/* 6. Passport Details */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <CardHeader title="Passport Details" section="passport" editing={editingSection} onEdit={() => startEdit("passport", {})} />
            {editingSection === "passport" ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Do you have a Passport?</label>
                  <select value={passportDraft.hasPassport} onChange={e => setPassportDraft({...passportDraft, hasPassport: e.target.value})} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <EditField label="Passport Number" field="passportNumber" draft={passportDraft} setDraft={setPassportDraft} />
                <EditField label="Passport Expiry Date" field="passportExpiry" draft={passportDraft} setDraft={setPassportDraft} />
                <SaveCancel onSave={() => saveSection("passport")} onCancel={cancelEdit} />
              </div>
            ) : (
              <FieldGrid pairs={[["Has Passport", passportDetails.hasPassport], ["Passport Number", passportDetails.passportNumber], ["Expiry Date", passportDetails.passportExpiry]]} />
            )}
          </div>

          {/* 7. Insurance / Policy Details */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <CardHeader title="Insurance / Policy Details" section="insurance" editing={editingSection} onEdit={() => startEdit("insurance", {})} />
            {editingSection === "insurance" ? (
              <div className="grid grid-cols-2 gap-3">
                {(["policyNumber","memberId","policyStartDate","policyEndDate"] as (keyof InsuranceDetails)[]).map(f => (
                  <EditField key={f} label={f.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase())} field={f} draft={insuranceDraft} setDraft={setInsuranceDraft} />
                ))}
                <div className="col-span-2"><SaveCancel onSave={() => saveSection("insurance")} onCancel={cancelEdit} /></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {([ ["Policy Number",insuranceDetails.policyNumber],["Member ID",insuranceDetails.memberId],["Policy Start Date",insuranceDetails.policyStartDate],["Policy End Date",insuranceDetails.policyEndDate] ] as [string,string][]).map(([label,value]) => (
                  <div key={label}><span className="text-xs text-slate-500 block mb-0.5">{label}</span><span className="text-xs font-semibold text-slate-800">{value || "—"}</span></div>
                ))}
              </div>
            )}
          </div>

          {/* 8. Educational Documents */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <CardHeader title="Educational Documents" section="educational" editing={editingSection} onEdit={() => startEdit("educational", {})} />
            {editingSection === "educational" ? (
              <div className="space-y-3">
                <EditField label="Highest Level of Education" field="highestEducation" draft={educationalDraft} setDraft={setEducationalDraft} />
                <UploadField label="Schooling Certificate" />
                <UploadField label="UG Certificate" />
                <UploadField label="PG Certificate" />
                <SaveCancel onSave={() => saveSection("educational")} onCancel={cancelEdit} />
              </div>
            ) : (
              <div className="space-y-3">
                <FieldRow label="Highest Education" value={educationalDocs.highestEducation} />
                <div className="pt-1 space-y-2">
                  {["Schooling Certificate", "UG Certificate", "PG Certificate"].map(label => (
                    <div key={label} className="flex items-center justify-between border border-slate-100 rounded-lg px-3 py-2">
                      <span className="text-xs text-slate-600">{label}</span>
                      <span className="text-xs text-slate-400 italic">No file uploaded</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 9. Professional Documents */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Professional Documents (Previous)</h3>
            </div>
            <div className="space-y-3">
              <UploadField label="Relieving Certificate" />
              <UploadField label="Experience Certificate" />
            </div>
          </div>

          {/* 10. Family Information */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <CardHeader title="Family Information" section="family" editing={editingSection} onEdit={() => startEdit("family", {})} />
            {editingSection === "family" ? (
              <div className="grid grid-cols-2 gap-3">
                {(["spouseName","spouseRole","spouseOrg","numberOfChildren"] as (keyof FamilyInfo)[]).map(f => (
                  <EditField key={f} label={f.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase())} field={f} draft={familyDraft} setDraft={setFamilyDraft} />
                ))}
                <div className="col-span-2"><SaveCancel onSave={() => saveSection("family")} onCancel={cancelEdit} /></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {([ ["Spouse Name",familyInfo.spouseName],["Spouse Employment Role",familyInfo.spouseRole],["Spouse Organization",familyInfo.spouseOrg],["Number of Children",familyInfo.numberOfChildren] ] as [string,string][]).map(([label,value]) => (
                  <div key={label}><span className="text-xs text-slate-500 block mb-0.5">{label}</span><span className="text-xs font-semibold text-slate-800">{value || "—"}</span></div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
