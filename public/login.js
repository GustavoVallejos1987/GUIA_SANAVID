document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('clave').value;

  try {
    const res = await fetch('http://localhost:5000/api/usuarios/login', {  // ✅ Ruta completa
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password }) // ✅ Se espera "nombre"
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      alert('Login exitoso');
      window.location.href = 'prestadores.html'; // ✅ Página destino
    } else {
      alert(data.mensaje || 'Credenciales incorrectas');
    }
  } catch (err) {
    alert('Error al conectar con el servidor');
    console.error(err);
  }
});
