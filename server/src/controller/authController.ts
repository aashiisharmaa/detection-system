import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const signup = async (req: Request, res: Response):Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' });
      return
    }
    
    // Create new user
    const user = new User({ email, password });
    await user.save();
    
    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
    
    res.status(201).json({ token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response):Promise<void> => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400).json({ message: 'Send All Required Fields' });
        return;
    }

    if(password.length<8){
      res.status(400).json({ message: 'Password Should Be Greater Then 8' });
        return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const isMatch = await existingUser.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return
    }
    
    // Generate JWT
    const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
    
    res.json({ token });
    return
    }else{
      const user = new User({ email, password });
    await user.save();
    
    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
    
    res.status(201).json({ token });
    return;
    }
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};