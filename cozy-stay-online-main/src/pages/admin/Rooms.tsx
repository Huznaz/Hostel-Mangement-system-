import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import {
  Search, Plus, Pencil, Trash2, X, BedDouble,
  Users, Star, Utensils, PawPrint, Loader2, Save, ImagePlus
} from 'lucide-react';
import RoomImage from '@/components/rooms/RoomImage';
import {
  resolveRoomImages,
  roomImagesNeedSync,
} from '@/utils/roomImages';

interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  capacity: number;
  size: number;
  breakfast: boolean;
  pets: boolean;
  featured: boolean;
  type: string;
  amenities: string[];
}

const EMPTY_ROOM: Omit<Room, 'id'> = {
  name: '', description: '', price: 0, images: [''],
  capacity: 1, size: 0, breakfast: false, pets: false,
  featured: false, type: 'Standard', amenities: [],
};

const ROOM_TYPES = ['Standard','Dormitory','Private Room','Deluxe','Suite','Family Room',
  'Business','Economy','Studio','Apartment','Penthouse','Presidential','Premium',
  'Accessible','Luxury','Family'];

const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
  <div className="flex items-center justify-between p-3 border rounded-lg">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button type="button" onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${checked ? 'bg-hotel-gold' : 'bg-gray-200'}`}>
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
        ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

const AdminRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookedRoomIds, setBookedRoomIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form, setForm] = useState<Omit<Room, 'id'>>(EMPTY_ROOM);
  const [amenityInput, setAmenityInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchRooms();
    fetchBookedRooms();
    const channel = supabase.channel('admin:rooms-crud')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, fetchRooms)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchBookedRooms)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    const { data } = await supabase.from('rooms').select('*').order('id');
    if (data) {
      const normalized = (data as Room[]).map((room) => {
        const images = resolveRoomImages(room.images, room.id, room.name);
        return { ...room, images };
      });
      setRooms(normalized);

      // One-time repair: persist working URLs when DB still has legacy/broken links
      void Promise.all(
        (data as Room[]).map(async (room) => {
          const images = resolveRoomImages(room.images, room.id, room.name);
          if (!roomImagesNeedSync(room.images, images)) return;
          await supabase.from('rooms').update({ images }).eq('id', room.id);
        }),
      );
    }
    setLoading(false);
  };

  const fetchBookedRooms = async () => {
    const now = new Date().toISOString().slice(0, 10);
    const { data } = await supabase.from('orders')
      .select('room_id, check_in_date, check_out_date, status')
      .in('status', ['pending', 'confirmed']);
    if (data) {
      setBookedRoomIds(data
        .filter((o: any) => o.check_in_date <= now && o.check_out_date >= now)
        .map((o: any) => o.room_id));
    }
  };

  const openAdd = () => {
    setEditingRoom(null);
    setForm(EMPTY_ROOM);
    setAmenityInput('');
    setShowModal(true);
  };

  const openEdit = (room: Room) => {
    setEditingRoom(room);
    const { id, ...rest } = room;
    setForm({ ...rest, images: rest.images?.length ? rest.images : [''] });
    setAmenityInput('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingRoom(null); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: 'Room name is required', variant: 'destructive' }); return; }
    if (form.price <= 0)   { toast({ title: 'Price must be greater than 0', variant: 'destructive' }); return; }

    setSaving(true);
    const payload = {
      ...form,
      images: form.images.filter(i => i.trim() !== ''),
      price: Number(form.price),
      capacity: Number(form.capacity),
      size: Number(form.size),
    };

    if (editingRoom) {
      const { error } = await supabase.from('rooms').update(payload).eq('id', editingRoom.id);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
      else { toast({ title: 'Room updated successfully' }); closeModal(); fetchRooms(); }
    } else {
      const { error } = await supabase.from('rooms').insert(payload);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
      else { toast({ title: 'Room added successfully' }); closeModal(); fetchRooms(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
    else { toast({ title: 'Room deleted' }); fetchRooms(); }
    setDeleteConfirm(null);
  };

  const addAmenity = () => {
    const val = amenityInput.trim();
    if (val && !form.amenities.includes(val)) {
      setForm(f => ({ ...f, amenities: [...f.amenities, val] }));
    }
    setAmenityInput('');
  };

  const removeAmenity = (a: string) =>
    setForm(f => ({ ...f, amenities: f.amenities.filter(x => x !== a) }));

  const updateImage = (i: number, val: string) => {
    const imgs = [...form.images];
    imgs[i] = val;
    setForm(f => ({ ...f, images: imgs }));
  };

  const addImageField = () => setForm(f => ({ ...f, images: [...f.images, ''] }));
  const removeImageField = (i: number) =>
    setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const types = ['all', ...Array.from(new Set(rooms.map(r => r.type)))];
  const filtered = rooms.filter(r => {
    const ms = r.name.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase());
    const mt = filterType === 'all' || r.type === filterType;
    return ms && mt;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
            {rooms.length - bookedRoomIds.length} Available
          </span>
          <span className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
            {bookedRoomIds.length} Occupied
          </span>
          <Button onClick={openAdd} className="bg-hotel-gold hover:bg-hotel-gold/90 text-white gap-2">
            <Plus className="h-4 w-4" /> Add Room
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search rooms..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize
                ${filterType === t ? 'bg-hotel-gold text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Room grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-400"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {rooms.length === 0 ? (
            <div>
              <BedDouble className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="mb-4">No rooms yet. Add your first room!</p>
              <Button onClick={openAdd} className="bg-hotel-gold hover:bg-hotel-gold/90 text-white gap-2">
                <Plus className="h-4 w-4" /> Add Room
              </Button>
            </div>
          ) : 'No rooms match your search.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(room => {
            const isBooked = bookedRoomIds.includes(room.id);
            return (
              <Card key={room.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <RoomImage images={room.images} alt={room.name} />
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isBooked ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                      {isBooked ? 'Occupied' : 'Available'}
                    </span>
                  </div>
                  {room.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-hotel-gold text-white">
                        <Star className="h-3 w-3" /> Featured
                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{room.name}</h3>
                    <span className="text-sm font-bold text-hotel-gold">
                      KSH {room.price.toLocaleString()}<span className="text-xs font-normal text-gray-400">/month</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{room.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {room.capacity}</span>
                    <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" /> {room.size}m²</span>
                    {room.breakfast && <span className="flex items-center gap-1"><Utensils className="h-3 w-3" /> Breakfast</span>}
                    {room.pets && <span className="flex items-center gap-1"><PawPrint className="h-3 w-3" /> Pets</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{room.type}</span>
                    {room.amenities?.slice(0, 3).map(a => (
                      <span key={a} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{a}</span>
                    ))}
                    {(room.amenities?.length || 0) > 3 && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full">+{room.amenities.length - 3} more</span>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button size="sm" variant="outline" onClick={() => openEdit(room)} className="flex-1 gap-1 text-blue-600 border-blue-200 hover:bg-blue-50">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    {deleteConfirm === room.id ? (
                      <div className="flex gap-1 flex-1">
                        <Button size="sm" onClick={() => handleDelete(room.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs">Confirm</Button>
                        <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 text-xs">Cancel</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(room.id)} className="flex-1 gap-1 text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Basic info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label>Room Name *</Label>
                  <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Deluxe Double Room" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label>Description</Label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the room..."
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Monthly Rent (KSH) *</Label>
                  <Input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} placeholder="5000" />
                </div>
                <div className="space-y-1.5">
                  <Label>Room Type</Label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Capacity (students)</Label>
                  <Input type="number" min="1" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: Number(e.target.value) }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Size (m²)</Label>
                  <Input type="number" min="0" value={form.size} onChange={e => setForm(f => ({ ...f, size: Number(e.target.value) }))} />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Toggle checked={form.breakfast} onChange={() => setForm(f => ({ ...f, breakfast: !f.breakfast }))} label="Breakfast Included" />
                <Toggle checked={form.pets}      onChange={() => setForm(f => ({ ...f, pets: !f.pets }))}           label="Pets Allowed" />
                <Toggle checked={form.featured}  onChange={() => setForm(f => ({ ...f, featured: !f.featured }))}   label="Featured Room" />
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><ImagePlus className="h-4 w-4" /> Image URLs</Label>
                {form.images.map((img, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={img}
                      onChange={e => updateImage(i, e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1"
                    />
                    {form.images.length > 1 && (
                      <Button size="sm" variant="outline" onClick={() => removeImageField(i)} className="text-red-500 border-red-200 hover:bg-red-50 px-2">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {form.images.length < 5 && (
                  <Button size="sm" variant="outline" onClick={addImageField} className="gap-1 text-gray-600">
                    <Plus className="h-3.5 w-3.5" /> Add another image URL
                  </Button>
                )}
                {form.images[0] && (
                  <div className="mt-2 h-28 w-full rounded-lg overflow-hidden bg-gray-100">
                    <RoomImage src={form.images[0]} alt="preview" />
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="flex gap-2">
                  <Input
                    value={amenityInput}
                    onChange={e => setAmenityInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(); } }}
                    placeholder="e.g. Free WiFi, AC, TV..."
                    className="flex-1"
                  />
                  <Button size="sm" onClick={addAmenity} variant="outline" className="gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
                </div>
                {form.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.amenities.map(a => (
                      <span key={a} className="flex items-center gap-1 text-xs px-2 py-1 bg-hotel-gold/10 text-hotel-gold border border-hotel-gold/30 rounded-full">
                        {a}
                        <button onClick={() => removeAmenity(a)} className="hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-hotel-gold hover:bg-hotel-gold/90 text-white gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving…' : editingRoom ? 'Save Changes' : 'Add Room'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;