import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  MapPin, 
  MessageSquare, 
  CheckCircle2, 
  Trash2,
  Tag
} from 'lucide-react';
import { MarketplaceItem } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface CampusMarketViewProps {
  items: MarketplaceItem[];
  onAddItem: (item: Omit<MarketplaceItem, 'id'>) => void;
  onToggleSold: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

const CATEGORIES: MarketplaceItem['category'][] = [
  'Textbooks',
  'Dorm & Living',
  'Electronics',
  'Bikes & Transit',
  'Course Gear'
];

export const CampusMarketView: React.FC<CampusMarketViewProps> = ({
  items,
  onAddItem,
  onToggleSold,
  onDeleteItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contactModalItem, setContactModalItem] = useState<MarketplaceItem | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<MarketplaceItem['category']>('Textbooks');
  const [newCondition, setNewCondition] = useState<MarketplaceItem['condition']>('Like New');
  const [newLocation, setNewLocation] = useState('Student Union / North Dorms');
  const [newContact, setNewContact] = useState('alex_r@campus.edu');
  const [newDesc, setNewDesc] = useState('');

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newPrice);
    if (!newTitle.trim() || isNaN(priceNum)) return;

    onAddItem({
      title: newTitle.trim(),
      price: priceNum,
      category: newCategory,
      condition: newCondition,
      sellerName: 'Alex Rivera (You)',
      contactInfo: newContact.trim(),
      location: newLocation.trim() || 'Campus Center',
      status: 'available',
      postedDate: new Date().toISOString().split('T')[0],
      description: newDesc.trim() || 'Available for immediate campus pickup.'
    });

    setNewTitle('');
    setNewPrice('');
    setNewDesc('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <span>Campus Buy & Sell Market</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Peer-to-peer student marketplace for textbooks, calculators, dorm furniture, and campus bikes.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Post Item for Sale</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-lg placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500 w-full sm:w-48"
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-3 ${
              item.status === 'sold'
                ? 'bg-zinc-950/50 border-zinc-850 opacity-60'
                : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  {/* Clean unboxed metadata per Frontend-Design Section 1.A */}
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 font-mono">
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.condition}</span>
                  </div>
                  <h2 className="text-sm font-semibold text-zinc-100 mt-1 line-clamp-1">
                    {item.title}
                  </h2>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                    {formatCurrency(item.price)}
                  </div>
                  {item.status === 'sold' && (
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">
                      Sold
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-zinc-300 mt-2 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-3 pt-2 border-t border-zinc-850 space-y-1 text-[11px] text-zinc-400">
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                  <span>Pickup: {item.location}</span>
                </div>
                <div className="truncate">
                  Seller: {item.sellerName}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-850 flex items-center justify-between gap-2">
              <button
                onClick={() => onToggleSold(item.id)}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {item.status === 'sold' ? 'Mark Available' : 'Mark as Sold'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setContactModalItem(item)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Contact</span>
                </button>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1 text-zinc-500 hover:text-rose-400 transition-colors rounded"
                  title="Delete listing"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Seller Modal */}
      {contactModalItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Contact Campus Seller</span>
              </h2>
              <button
                onClick={() => setContactModalItem(null)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <div className="text-xs font-semibold text-zinc-200">{contactModalItem.title}</div>
                <div className="text-sm font-mono text-emerald-400 font-bold mt-0.5">
                  {formatCurrency(contactModalItem.price)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Seller Contact Info:
                </label>
                <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-indigo-300 select-all">
                  {contactModalItem.contactInfo}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Suggested Message:
                </label>
                <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 leading-relaxed italic select-all">
                  "Hey! I saw your listing for {contactModalItem.title} on Student Life OS. Is it still available to meet near {contactModalItem.location}?"
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setContactModalItem(null)}
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Listing Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Post Item to Campus Market</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Item Title *
                </label>
                <input
                  required
                  placeholder="e.g. TI-84 Plus CE, CLRS Algorithms, Dorm Fan"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Asking Price ($) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    placeholder="25"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Condition
                  </label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="New / Sealed">New / Sealed</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Campus Pickup Location
                  </label>
                  <input
                    placeholder="e.g. Student Union Lobby"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Your Contact Handle / Email
                </label>
                <input
                  placeholder="e.g. student@campus.edu or IG: @handle"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Item Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Included accessories, condition details, reasons for selling..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  Post Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
