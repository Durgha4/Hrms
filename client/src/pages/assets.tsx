import { useState } from "react";
import { useMe } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";

interface Asset {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  assignedDate: string;
  status: "Active" | "Inactive" | "Pending";
}

interface AssetRequest {
  id: string;
  assetType: string;
  reason: string;
  requestDate: string;
  status: "Approved" | "Pending" | "Rejected";
  comments?: string;
}

const mockAssets: Asset[] = [];

const mockRequests: AssetRequest[] = [];

export default function Assets() {
  const { data: user, isLoading } = useMe();
  const [assets] = useState<Asset[]>(mockAssets);
  const [requests] = useState<AssetRequest[]>(mockRequests);
  const [showRequestModal, setShowRequestModal] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <DashboardLayout title="Assets">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Assets</h1>
            <p className="text-sm text-slate-500 mt-1">View assigned assets and request new ones</p>
          </div>
          <Button
            onClick={() => setShowRequestModal(true)}
            className="text-white flex items-center gap-2"
            style={{ backgroundColor: "#0F3D57" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0C2D44"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0F3D57"}
            data-testid="button-request-asset"
          >
            <Plus className="w-4 h-4" />
            Request Asset
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6">
          {/* Total Assets Card */}
          <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm" data-testid="card-total-assets">
            <p className="text-xs font-semibold mb-4" style={{ color: "#0F3D57" }}>TOTAL ASSETS</p>
            <p className="text-4xl font-bold text-slate-900">{assets.length}</p>
          </div>

          {/* Active Card */}
          <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm" data-testid="card-active">
            <p className="text-xs font-semibold mb-4" style={{ color: "#0F3D57" }}>ACTIVE</p>
            <p className="text-4xl font-bold text-slate-900">
              {assets.filter(a => a.status === "Active").length}
            </p>
          </div>

          {/* Pending Requests Card */}
          <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm" data-testid="card-pending">
            <p className="text-xs font-semibold mb-4" style={{ color: "#0F3D57" }}>PENDING REQUESTS</p>
            <p className="text-4xl font-bold text-slate-900">
              {requests.filter(r => r.status === "Pending").length}
            </p>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" data-testid="section-assets-table">
          <div className="text-white px-6 py-4" style={{ backgroundColor: "#0F3D57" }}>
            <h2 className="text-lg font-semibold">Assets</h2>
          </div>
          {assets.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 font-medium" data-testid="text-no-assets">
                No assets assigned yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-white" style={{ backgroundColor: "#0F3D57" }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Serial Number</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Assigned Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map(asset => (
                    <tr key={asset.id} className="border-b border-slate-200 hover:bg-slate-50" data-testid={`row-asset-${asset.id}`}>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">{asset.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{asset.type}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{asset.serialNumber}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{asset.assignedDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(asset.status)}`}>
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Asset Requests Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" data-testid="section-requests-table">
          <div className="text-white px-6 py-4" style={{ backgroundColor: "#0F3D57" }}>
            <h2 className="text-lg font-semibold">My Asset Requests</h2>
          </div>
          {requests.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 font-medium" data-testid="text-no-requests">
                No asset requests yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-white" style={{ backgroundColor: "#0F3D57" }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Asset Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Request Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(request => (
                    <tr key={request.id} className="border-b border-slate-200 hover:bg-slate-50" data-testid={`row-request-${request.id}`}>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">{request.assetType}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{request.reason}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{request.requestDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{request.comments || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Request Asset Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="modal-request-asset">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Request Asset</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600 block mb-2">Asset Type</label>
                  <input
                    type="text"
                    placeholder="Enter asset type"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ focusColor: "#0F3D57" }}
                    data-testid="input-asset-type"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 block mb-2">Reason</label>
                  <textarea
                    placeholder="Enter reason for request"
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 resize-none"
                    style={{ focusColor: "#0F3D57" }}
                    data-testid="input-reason"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1 border border-slate-300 text-slate-600 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1 text-white py-2 rounded-lg text-sm font-semibold"
                    style={{ backgroundColor: "#0F3D57" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0C2D44"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0F3D57"}
                    data-testid="button-submit-request"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
