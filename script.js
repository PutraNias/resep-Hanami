// ========== GLOBAL VARIABLES ==========
let resepData = [];
const modal = document.getElementById('modalResep');
const btnTambah = document.getElementById('tambahResepBtn');
const spanClose = document.querySelector('.close');
const resepForm = document.getElementById('resepForm');
const resepList = document.getElementById('resepList');
const btnHapus = document.getElementById('hapusResepBtn');
const modalTitle = document.getElementById('modalTitle');
const uploadInput = document.getElementById('uploadGambar');
const previewDiv = document.getElementById('previewGambar');

// ========== FIRESTORE FUNCTIONS ==========
async function getResepData() {
  const snapshot = await db.collection("resep").orderBy("createdAt", "desc").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function saveResep(resep) {
  if (resep.id) {
    await db.collection("resep").doc(resep.id).update(resep);
  } else {
    const docRef = await db.collection("resep").add({
      ...resep,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    resep.id = docRef.id;
  }
  return resep;
}

async function deleteResep(id) {
  await db.collection("resep").doc(id).delete();
}

// ========== STORAGE FUNCTIONS ==========
async function uploadImage(file) {
  const storageRef = storage.ref(`resep-images/${Date.now()}_${file.name}`);
  await storageRef.put(file);
  return await storageRef.getDownloadURL();
}

// ========== UI FUNCTIONS ==========
function renderResep() {
  resepList.innerHTML = '';
  
  resepData.forEach(resep => {
    const card = document.createElement('div');
    card.className = 'resep-card';
    card.innerHTML = `
      <img src="${resep.gambar || 'https://via.placeholder.com/300x200?text=No+Image'}" 
           alt="${resep.nama}" 
           onerror="this.src='https://via.placeholder.com/300x200?text=Gambar+Error'">
      <div class="resep-info">
        <h3>${resep.nama}</h3>
        <p>${resep.deskripsi}</p>
        <small>⏱ ${resep.waktu}</small>
        <div class="action-buttons">
          <button onclick="editResep('${resep.id}')">Edit</button>
          <button onclick="lihatDetail('${resep.id}')">Lihat Resep</button>
        </div>
      </div>
    `;
    resepList.appendChild(card);
  });
}

function resetForm() {
  resepForm.reset();
  previewDiv.innerHTML = '';
  document.getElementById('resepId').value = '';
}

// ========== EVENT HANDLERS ==========
// Buka modal tambah resep
btnTambah.addEventListener('click', () => {
  resetForm();
  modalTitle.textContent = 'Tambah Resep Baru';
  btnHapus.style.display = 'none';
  modal.style.display = 'block';
});

// Tutup modal
spanClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Preview gambar saat dipilih
uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      previewDiv.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  }
});

// Submit form
resepForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('resepId').value;
  const nama = document.getElementById('namaResep').value;
  const urlGambar = document.getElementById('gambarResep').value;
  const fileGambar = uploadInput.files[0];
  const deskripsi = document.getElementById('deskripsiResep').value;
  const caraMemasak = document.getElementById('caraMemasak').value.split('\n');
  const waktu = document.getElementById('waktuResep').value;

  // Upload gambar jika ada file
  let gambarResep = urlGambar;
  if (fileGambar) {
    try {
      gambarResep = await uploadImage(fileGambar);
    } catch (error) {
      alert('Gagal upload gambar: ' + error.message);
      return;
    }
  }

  const resep = {
    id,
    nama,
    gambar: gambarResep || 'https://via.placeholder.com/300x200?text=No+Image',
    deskripsi,
    caraMemasak,
    waktu
  };

  try {
    await saveResep(resep);
    renderResep();
    modal.style.display = 'none';
  } catch (error) {
    alert('Error menyimpan resep: ' + error.message);
  }
});

// Hapus resep
btnHapus.addEventListener('click', async () => {
  const id = document.getElementById('resepId').value;
  if (id && confirm('Apakah Anda yakin ingin menghapus resep ini?')) {
    try {
      await deleteResep(id);
      renderResep();
      modal.style.display = 'none';
    } catch (error) {
      alert('Gagal menghapus resep: ' + error.message);
    }
  }
});

// Pencarian
document.getElementById('search').addEventListener('input', (e) => {
  const keyword = e.target.value.toLowerCase();
  const cards = document.querySelectorAll('.resep-card');
  
  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = title.includes(keyword) ? 'block' : 'none';
  });
});

// Edit resep
window.editResep = async (id) => {
  const resep = resepData.find(item => item.id === id);
  if (resep) {
    document.getElementById('resepId').value = resep.id;
    document.getElementById('namaResep').value = resep.nama;
    document.getElementById('gambarResep').value = resep.gambar;
    document.getElementById('deskripsiResep').value = resep.deskripsi;
    document.getElementById('caraMemasak').value = resep.caraMemasak.join('\n');
    document.getElementById('waktuResep').value = resep.waktu;
    
    // Tampilkan preview gambar jika ada
    if (resep.gambar && !resep.gambar.startsWith('http')) {
      previewDiv.innerHTML = `<img src="${resep.gambar}" alt="Preview">`;
    } else {
      previewDiv.innerHTML = '';
    }
    
    modalTitle.textContent = 'Edit Resep';
    btnHapus.style.display = 'inline-block';
    modal.style.display = 'block';
  }
};

// Lihat detail resep
window.lihatDetail = (id) => {
  const resep = resepData.find(item => item.id === id);
  if (resep) {
    const steps = resep.caraMemasak.map((step, index) => 
      `<li>${step}</li>`
    ).join('');
    
    const detailHTML = `
      <h2>${resep.nama}</h2>
      <img src="${resep.gambar || 'https://via.placeholder.com/300x200?text=No+Image'}" 
           style="max-width:100%; margin:1rem 0; border-radius:5px;">
      <p><strong>Deskripsi:</strong> ${resep.deskripsi}</p>
      <p><strong>Waktu:</strong> ${resep.waktu}</p>
      <h3 style="margin-top:1rem;">Cara Memasak:</h3>
      <ol>${steps}</ol>
    `;
    
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${resep.nama}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
          img { max-width: 100%; height: auto; border-radius: 5px; }
          ol { margin-top: 1rem; padding-left: 1.5rem; }
          li { margin-bottom: 0.5rem; line-height: 1.6; }
        </style>
      </head>
      <body>
        ${detailHTML}
        <button onclick="window.print()" style="padding: 0.5rem 1rem; margin-top: 1rem; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer;">Cetak Resep</button>
      </body>
      </html>
    `);
  }
};

// ========== INITIAL LOAD ==========
async function init() {
  resepData = await getResepData();
  renderResep();
  
  // Real-time updates
  db.collection("resep")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      resepData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderResep();
    });
}

// Jalankan saat halaman dimuat
window.onload = init;