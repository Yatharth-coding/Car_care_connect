export function createProfileRow(profile, onEdit) {
    const row = document.createElement('tr')
    
    const nameCell = document.createElement('td')
    const emailCell = document.createElement('td')
    const actionsCell = document.createElement('td')
    
    nameCell.textContent = profile.first_name
    emailCell.textContent = profile.email
    
    const editButton = document.createElement('button')
    editButton.textContent = 'Edit'
    editButton.onclick = () => onEdit(profile)
    
    actionsCell.appendChild(editButton)
    
    row.appendChild(nameCell)
    row.appendChild(emailCell)
    row.appendChild(actionsCell)
    
    return row
}

export function showEditModal(profile, onSave) {
    const modal = document.getElementById('editModal')
    const nameInput = document.getElementById('editName')
    const emailInput = document.getElementById('editEmail')
    
    nameInput.value = profile.first_name
    emailInput.value = profile.email
    
    modal.style.display = 'block'
    
    const saveButton = document.getElementById('saveButton')
    saveButton.onclick = async () => {
        await onSave({
            first_name: nameInput.value,
            email: emailInput.value
        })
        modal.style.display = 'none'
    }
    
    const closeButton = document.querySelector('.close')
    closeButton.onclick = () => {
        modal.style.display = 'none'
    }
}