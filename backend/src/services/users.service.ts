import * as authRepository from "../repositories/auth.repository"

export const getCurrentUser = async (userId: number) => {
    const user = await authRepository.findUserById(userId)

    if (!user) {
        throw new Error("Usuario no encontrado")
    }

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        address: user.address,
        role: user.role,
        status: user.status
    }
}

export const updateCurrentUser = async (userId: number, updateData: any) => {
    // First get the current user to merge data
    const currentUser = await authRepository.findUserById(userId)

    if (!currentUser) {
        throw new Error("Usuario no encontrado")
    }

    // Update the user in database
    // For now, we'll need to add an update function to the repository
    // Let's create a simple update query

    const updatedUser = await authRepository.updateUserById(userId, updateData)

    return {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        status: updatedUser.status
    }
}