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
    setEntries([...entries, newEntry].sort((a, b) => new Date(a.date) - new Date(b.date)));
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
    const entry = entries[index];
    setForm(entry);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Sholat Journal</h1>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Tanggal</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border rounded p-2 w-full mb-4"
        />

        <label className="block text-gray-700 font-semibold mb-2">Puasa</label>
        <input
          type="checkbox"
          name="puasa"
          checked={form.puasa}
          onChange={handleChange}
          className="mb-4"
        />

        <label className="block text-gray-700 font-semibold mb-2">Sholat Fardu</label>
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

        <label className="block text-gray-700 font-semibold mb-2">Sholat Sunnah</label>
        <div className="flex flex-wrap mb-4 space-x-4">
          {['dhuha', 'tahajud', 'witir', 'rawatib'].map((sunnah, index) => (
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

        <label className="block text-gray-700 font-semibold mb-2">Tadarus</label>
        <input
          type="text"
          name="tadarus"
          value={form.tadarus}
          onChange={handleChange}
          className="border rounded p-2 w-full mb-4"
        />

        <label className="block text-gray-700 font-semibold mb-2">Catatan</label>
        <textarea
          name="catatan"
          value={form.catatan}
          onChange={handleChange}
          className="border rounded p-2 w-full mb-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 w-full rounded"
        >
          Add Entry
        </button>
      </div>

      <div className="flex flex-wrap -mx-2">
        {entries.map((entry, index) => (
          <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <p><strong>Tanggal:</strong> {entry.date}</p>
              <p><strong>Puasa:</strong> {entry.puasa ? 'Yes' : 'No'}</p>
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
                  className="bg-yellow-500 text-white p-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;