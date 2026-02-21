<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Portfolio BorneoCodeLab</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f8f9fc; }
        .sidebar { min-height: 100vh; background: #2c3e50; color: white; padding: 20px;}
        .sidebar a { color: rgba(255,255,255,.8); text-decoration: none; display: block; padding: 10px; border-radius: 5px; margin-bottom: 5px;}
        .sidebar a:hover, .sidebar a.active { background: #34495e; color: white; }
        .content { padding: 30px; }
        .portfolio-image { width: 100px; height: 60px; object-fit: cover; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="d-flex">
        <!-- Sidebar -->
        <div class="sidebar" style="width: 250px;">
            <div class="d-flex align-items-center mb-4 pb-3 border-bottom border-secondary">
                <i class="ph ph-laptop fs-3 me-2"></i>
                <h5 class="m-0">BorneoCodeLab</h5>
            </div>
            <a href="#" class="active"><i class="ph ph-briefcase me-2"></i> Portfolio</a>
            <a href="../index.html" target="_blank"><i class="ph ph-globe me-2"></i> Lihat Website</a>
        </div>

        <!-- Main Content -->
        <div class="content flex-grow-1">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Manajemen Portfolio</h2>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#portfolioModal" onclick="resetForm()">
                    <i class="ph ph-plus"></i> Tambah Portfolio
                </button>
            </div>

            <div class="card shadow-sm border-0">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>Gambar</th>
                                    <th>Judul</th>
                                    <th>Kategori</th>
                                    <th>Tags</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="portfolioTable">
                                <tr><td colspan="5" class="text-center">Loading...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Form -->
    <div class="modal fade" id="portfolioModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle">Tambah Portfolio</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="portfolioForm">
                        <input type="hidden" id="portfolioId">
                        <div class="mb-3">
                            <label class="form-label">Judul Portfolio</label>
                            <input type="text" class="form-control" id="title" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Kategori</label>
                            <select class="form-select" id="category" required>
                                <option value="TOKO ONLINE">TOKO ONLINE</option>
                                <option value="COMPANY PROFILE">COMPANY PROFILE</option>
                                <option value="LANDING PAGE">LANDING PAGE</option>
                                <option value="SISTEM INFORMASI">SISTEM INFORMASI</option>
                                <option value="CUSTOM">CUSTOM</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">URL Gambar</label>
                            <input type="url" class="form-control" id="image" required placeholder="https://picsum.photos/600/400">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Tags (pisahkan dengan koma)</label>
                            <input type="text" class="form-control" id="tags" placeholder="WordPress, WooCommerce" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Deskripsi Singkat</label>
                            <textarea class="form-control" id="description" rows="3" required></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="button" class="btn btn-primary" onclick="savePortfolio()">Simpan</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        const API_URL = 'api.php';
        let modal;
        let portfoliosData = [];

        document.addEventListener('DOMContentLoaded', () => {
            modal = new bootstrap.Modal(document.getElementById('portfolioModal'));
            loadPortfolios();
        });

        async function loadPortfolios() {
            try {
                const res = await fetch(API_URL);
                portfoliosData = await res.json();
                renderTable();
            } catch (error) {
                console.error(error);
                alert('Gagal memuat data');
            }
        }

        function renderTable() {
            const tbody = document.getElementById('portfolioTable');
            tbody.innerHTML = '';
            
            if (portfoliosData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Belum ada portfolio</td></tr>';
                return;
            }

            portfoliosData.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><img src="${p.image}" class="portfolio-image" alt="${p.title}"></td>
                    <td><strong>${p.title}</strong><div class="small text-muted text-truncate" style="max-width: 200px;">${p.description}</div></td>
                    <td><span class="badge bg-secondary">${p.category}</span></td>
                    <td>${p.tags}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editPortfolio('${p.id}')"><i class="ph ph-pencil-simple"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deletePortfolio('${p.id}')"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        function resetForm() {
            document.getElementById('portfolioForm').reset();
            document.getElementById('portfolioId').value = '';
            document.getElementById('modalTitle').innerText = 'Tambah Portfolio';
        }

        function editPortfolio(id) {
            const p = portfoliosData.find(x => x.id === id);
            if (!p) return;
            
            document.getElementById('portfolioId').value = p.id;
            document.getElementById('title').value = p.title;
            document.getElementById('category').value = p.category;
            document.getElementById('image').value = p.image;
            document.getElementById('tags').value = p.tags;
            document.getElementById('description').value = p.description;
            
            document.getElementById('modalTitle').innerText = 'Edit Portfolio';
            modal.show();
        }

        async function savePortfolio() {
            if (!document.getElementById('portfolioForm').checkValidity()) {
                document.getElementById('portfolioForm').reportValidity();
                return;
            }

            const id = document.getElementById('portfolioId').value;
            const data = {
                title: document.getElementById('title').value,
                category: document.getElementById('category').value,
                image: document.getElementById('image').value,
                tags: document.getElementById('tags').value,
                description: document.getElementById('description').value
            };

            const method = id ? 'PUT' : 'POST';
            if (id) data.id = id;

            try {
                const res = await fetch(API_URL, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (res.ok) {
                    modal.hide();
                    loadPortfolios();
                } else {
                    alert('Gagal menyimpan portfolio');
                }
            } catch (error) {
                console.error(error);
                alert('Gagal menyimpan portfolio');
            }
        }

        async function deletePortfolio(id) {
            if (confirm('Apakah Anda yakin ingin menghapus portfolio ini?')) {
                try {
                    const res = await fetch(API_URL, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: id })
                    });
                    
                    if (res.ok) {
                        loadPortfolios();
                    } else {
                        alert('Gagal menghapus portfolio');
                    }
                } catch (error) {
                    console.error(error);
                    alert('Gagal menghapus portfolio');
                }
            }
        }
    </script>
</body>
</html>
