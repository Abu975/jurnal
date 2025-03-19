import { useState, useEffect } from 'react';

const App = () => {
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem('sholatJournalEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  const [form, setForm] = useState({
    date: '',
    puasa: false,
    sholatFardu: {
      subuh: false,
      dzuhur: false,
      ashar: false,
      maghrib: false,
      isha: false
    },
    sholatSunnah: {
      dhuha: false,
      tahajud: false,
      witir: false,
      rawatib: false
    },
    tadarus: '',
    catatan: ''
  });
  const [edited, setEdited] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const doEdit = (index) => {
    setEdited(true);
    setEditIndex(index);
  }

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setForm((prevForm) => ({
      ...prevForm,
      date: today
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem('sholatJournalEntries', JSON.stringify(entries));
  }, [entries]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name.includes('sholatFardu')) {
        const farduName = name.split('.')[1];
        setForm((prevForm) => ({
          ...prevForm,
          sholatFardu: {
            ...prevForm.sholatFardu,
            [farduName]: checked
          }
        }));
      } else if (name.includes('sholatSunnah')) {
        const sunnahName = name.split('.')[1];
        setForm((prevForm) => ({
          ...prevForm,
          sholatSunnah: {
            ...prevForm.sholatSunnah,
            [sunnahName]: checked
          }
        }));
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          [name]: checked
        }));
      }
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value
      }));
    }
  };

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry = { ...form, date: form.date || today };
    // setEntries([...entries, newEntry].sort((a, b) => new Date(a.date) - new Date(b.date)));

    if (edited) { // Ditambah
      // Update the existing entry // Diubah
      const updatedEntries = entries.map((entry, index) => // Ditambah
        index === editIndex ? newEntry : entry // Ditambah
      ); // Ditambah
      setEntries(updatedEntries); // Ditambah
      setEdited(false); // Ditambah
      setEditIndex(null); // Ditambah
    } else { // Ditambah
      // Add a new entry
      setEntries([...entries, newEntry].sort((a, b) => new Date(a.date) - new Date(b.date)));
    }

    setForm({
      date: '',
      puasa: false,
      sholatFardu: {
        subuh: false,
        dzuhur: false,
        ashar: false,
        maghrib: false,
        isha: false
      },
      sholatSunnah: {
        dhuha: false,
        tahajud: false,
        witir: false,
        rawatib: false
      },
      tadarus: '',
      catatan: ''
    });
  };

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
  };

  const handleEdit = (index) => {
    doEdit(index);
    const entry = entries[index];
    setForm(entry);
  };

  const clearForm = () => {
    setForm({
      date: '',
      puasa: false,
      sholatFardu: {
        subuh: false,
        dzuhur: false,
        ashar: false,
        maghrib: false,
        isha: false
      },
      sholatSunnah: {
        dhuha: false,
        tahajud: false,
        witir: false,
        rawatib: false
      },
      tadarus: '',
      catatan: ''
    });
    setEdited(false);
    setEditIndex(null);
  }

  return (
    <div className="main">
      <div className="container mx-auto p-4">
        {/* <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mb-6"> */}
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mb- mt-10 text-slate-900">
        <h1 className="text-3xl text-[#4C9A61] font-(family-name:Noto-serif) font-bold mt mb-8 text-center">Jurnal<br></br>Ramadhan</h1>
          <label className="block text-slate-900 font-semibold mb-2 ">Tanggal</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border text-slate-900 rounded p-2 w-full mb-4"
          />

          <label className="block text-slate-900 font-semibold mb-2">Puasa</label>
          <input
            type="checkbox"
            name="puasa"
            checked={form.puasa}
            onChange={handleChange}
            className="mb-4"
          />

          <label className="block text-slate-900 font-semibold mb-2">Sholat Fardu</label>
          <div className="flex flex-wrap mb-4 space-x-4">
            {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isha'].map((sholat, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  name={`sholatFardu.${sholat}`}
                  checked={form.sholatFardu[sholat]}
                  onChange={handleChange}
                  className="mr-2"
                />
                {sholat.charAt(0).toUpperCase() + sholat.slice(1)}
              </label>
            ))}
          </div>

          <label className="block text-slate-900 font-semibold mb-2">Sholat Sunnah</label>
          <div className="flex flex-wrap mb-4 space-x-4">
            {['tahajud', 'dhuha', 'tarawih', 'witir', 'rawatib', 'qobliyah', 'badiyah'].map((sunnah, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  name={`sholatSunnah.${sunnah}`}
                  checked={form.sholatSunnah[sunnah]}
                  onChange={handleChange}
                  className="mr-2"
                />
                {sunnah.charAt(0).toUpperCase() + sunnah.slice(1)}
              </label>
            ))}
          </div>

          <label className="block text-slate-900 font-semibold mb-2">Tadarus</label>
          <input
            type="text"
            name="tadarus"
            value={form.tadarus}
            onChange={handleChange}
            className="border rounded p-2 w-full mb-4"
          />

          <label className="block text-slate-900 font-semibold mb-2">Catatan</label>
          <textarea
            name="catatan"
            value={form.catatan}
            onChange={handleChange}
            className="border rounded p-2 w-full mb-4"
          />
          {edited ? (
            <>
              <button
                onClick={handleSubmit}
                className="cursor-pointer bg-[#4C9A61] text-white hover:bg-transparent hover:border-[#4C9A61] hover:border-2 hover:text-[#4C9A61] active:text-white active:bg-[#4C9A61] p-2 w-full rounded"
              >
                Simpan Perubahan
              </button>
              <button
                onClick={() => {
                  clearForm()
                  setEdited(false)
                }
                }
                className='cursor-pointer bg-[#b89e2b] text-white hover:bg-transparent hover:border-[#4C9A61] hover:border-2 hover:text-[#4C9A61] active:text-white active:bg-[#4C9A61] p-2 w-full rounded mt-4'
              >
                Batal
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSubmit}
                className="cursor-pointer bg-[#4C9A61] text-white hover:bg-transparent hover:border-[#4C9A61] hover:border-2 hover:text-[#4C9A61] active:text-white active:bg-[#4C9A61] p-2 w-full rounded"
              >
                Tambahkan Jurnal
              </button>

            </>
          )
          }
        </div >

        <div className="flex flex-wrap -mx-2 mb-20 mt-20">
          {entries.map((entry, index) => (
            <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
              <div className=" shadow-lg rounded-lg p-6 bg-white text-slate-900 hover:bg-slate-100 hover:border-2 hover:border-white transition-transform">
                <p><strong>Tanggal:</strong> {entry.date}</p>
                <p><strong>Puasa:</strong> {entry.puasa ? 'Berpuasa' : 'Tidak'}</p>
                <p><strong>Sholat Fardu:</strong></p>
                <ul className="list-disc list-inside">
                  {Object.entries(entry.sholatFardu).map(([key, value]) => (
                    value && <li key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</li>
                  ))}
                </ul>
                <p><strong>Sholat Sunnah:</strong></p>
                <ul className="list-disc list-inside">
                  {Object.entries(entry.sholatSunnah).map(([key, value]) => (
                    value && <li key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</li>
                  ))}
                </ul>
                <p><strong>Tadarus:</strong> {entry.tadarus}</p>
                <p><strong>Catatan:</strong> {entry.catatan}</p>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(index)}
                    className="cursor-pointer hover:bg-[#4C9A61] hover:text-white bg-transparent border-2 border-[#4C9A61] text-[#4C9A61] font-semibold p-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="cursor-pointer hover:bg-[#4C9A61] hover:text-white bg-transparent border-2 border-[#4C9A61] text-[#4C9A61] font-semibold p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div >
    </div>

  );
};

export default App;