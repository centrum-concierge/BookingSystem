"use client";

import { submitFormKAction } from "./actions";

type Building = { id: string; name: string; location: string };

const inputCls = "rounded-xl border border-[#d4ede0] bg-[#f4faf7] px-4 py-3 outline-none transition focus:border-[#0a6d3c] focus:ring-1 focus:ring-[#0a6d3c]/20";

export default function FormKClient({ buildings }: { buildings: Building[] }) {
  return (
    <form action={submitFormKAction} className="flex flex-col gap-8">

      {/* Section 1 — Re: (strata identifiers) */}
      <section className="grid gap-5 rounded-[24px] bg-white px-6 py-8 shadow-[0_4px_24px_rgba(10,109,60,0.08)] md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Re: Strata Lot Details</p>

        <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
          Building *
          <select
            name="buildingId"
            required
            defaultValue=""
            className={inputCls}
          >
            <option value="" disabled>Select a building…</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}{b.location ? ` — ${b.location}` : ""}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-5 sm:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
            Strata Plan *
            <input name="strataPlanNumber" required placeholder="e.g. EPS1234" className={inputCls} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
            Strata Lot *
            <input name="strataLotNumber" required placeholder="e.g. 42" className={inputCls} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
            Unit # *
            <input name="unitNumber" required placeholder="e.g. 301" className={inputCls} />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
          Street Address of Strata Lot *
          <input name="strataStreetAddress" required placeholder="e.g. 1234 Marine Dr, Vancouver, BC" className={inputCls} />
        </label>
      </section>

      {/* Section 2 — Tenant Information */}
      <section className="grid gap-5 rounded-[24px] bg-white px-6 py-8 shadow-[0_4px_24px_rgba(10,109,60,0.08)] md:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Name(s) of Tenant(s)</p>
          <p className="mt-1 text-sm text-[#4a6358]">Tenant 2 is optional — only fill in if there is a second occupant.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
            Tenant 1 — Full Name *
            <input name="tenant1FullName" required placeholder="Full legal name" className={inputCls} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
            Tenant 2 — Full Name <span className="font-normal text-[#4a6358]">(optional)</span>
            <input name="tenant2FullName" placeholder="Full legal name" className={inputCls} />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
          Tenant&apos;s Email
          <input name="tenantEmail" type="email" placeholder="tenant@email.com" className={inputCls} />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
            Tenant&apos;s Phone (cell)
            <input name="tenantPhoneCell" type="tel" placeholder="604-555-0100" className={inputCls} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
            Tenant&apos;s Phone (work)
            <input name="tenantPhoneWork" type="tel" placeholder="604-555-0200" className={inputCls} />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
          Tenancy Commencing *
          <input type="date" name="tenancyStartDate" required className={inputCls} />
        </label>
      </section>

      {/* Section 3 — Landlord Information */}
      <section className="grid gap-5 rounded-[24px] bg-white px-6 py-8 shadow-[0_4px_24px_rgba(10,109,60,0.08)] md:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#00a651]">Landlord / Owner Information</p>
          <p className="mt-1 text-sm text-[#4a6358]">The strata lot owner or their authorized agent.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
            Landlord Name (Please Print) *
            <input name="landlordName" required placeholder="Full legal name" className={inputCls} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27]">
            Landlord Contact Number(s)
            <input name="landlordContactNumber" type="tel" placeholder="604-555-0100" className={inputCls} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27] sm:col-span-2">
            Notice Address — Line 1
            <input name="landlordNoticeAddressLine1" placeholder="Street address" className={inputCls} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[#1e2a27] sm:col-span-2">
            Notice Address — Line 2
            <input name="landlordNoticeAddressLine2" placeholder="City, Province, Postal Code" className={inputCls} />
          </label>
        </div>
      </section>

      {/* Important Notice */}
      <div className="rounded-[16px] border border-[#d4ede0] bg-[#eef7f1] px-5 py-5 text-sm leading-7 text-[#4a6358]">
        <p className="mb-3 font-bold uppercase tracking-[0.1em] text-[#1e2a27]">Important Notice to Tenants</p>
        <ol className="flex flex-col gap-3">
          <li className="flex gap-3">
            <span className="font-bold">1.</span>
            <span>Under the <em>Strata Property Act</em>, a tenant in a strata corporation <strong>must</strong> comply with the bylaws and rules of the strata corporation that are in force from time to time (current bylaws and rules attached).</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold">2.</span>
            <span>The current bylaws and rules may be changed by the strata corporation, and if they are changed, the tenant <strong>must</strong> comply with the changed bylaws and rules.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold">3.</span>
            <span>If a tenant or occupant of the strata lot, or a person visiting the tenant or admitted by the tenant for any reason, contravenes a bylaw or rule, the tenant is responsible and may be subject to penalties, including fines, denial of access to recreation facilities, and if the strata corporation incurs costs for remedying a contravention, payment of those costs.</span>
          </li>
        </ol>
        <p className="mt-4 text-xs text-[#4a6358]">
          By submitting this form the Landlord acknowledges that, if your strata corporation has bylaws that require you to obtain permission to rent your strata lot, you must first obtain permission from your strata council. Submitting this Form K does not constitute permission to rent your strata lot.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-[#0a6d3c] px-10 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#00a651]"
        >
          Submit Form K
        </button>
      </div>
    </form>
  );
}
