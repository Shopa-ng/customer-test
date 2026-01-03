import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthLayout, Input, Button } from '../components';
import { COLORS } from '../constants/theme';
import { NavigationProp } from '../types/navigation';
import { login } from '../api/auth';

const LoginScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp>();
	const [email, setEmail] = useState('');
	const [pin, setPin] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		setError(null);
		if (!email.trim() || !pin.trim()) {
			setError('Incorrect Email or PIN!');
			return;
		}
		setIsLoading(true);
		try {
			await login({ email, pin });
			navigation.navigate('Home');
		} catch (e: any) {
			setError(e?.message || 'Login failed');
		} finally {
			setIsLoading(false);
		}
	};

	const handleForgotPin = () => {
		navigation.navigate('ForgotPin');
	};

	const handleBiometric = () => {
		// Handle biometric authentication
		console.log('Biometric authentication');
	};

	const handleSignUp = () => {
		navigation.navigate('SignUp');
	};

	return (
		<AuthLayout>
			<View className="px-6 pt-10 pb-4">
				{/* Header */}
				<Text className="mb-2 text-center text-2xl font-satoshi-bold text-text-primary leading-tight">
					LOGIN
				</Text>
				<Text className="mb-2 text-center text-sm font-plus-medium text-text-secondary leading-tight">
					Sign in to your Shopa account
				</Text>

				{/* Error Message */}
				{error && (
					<Text className="mb-2 text-center text-sm font-plus-medium text-error">
						{error}
					</Text>
				)}

				{/* Email/Phone Input */}
				<View className="mt-4">
					<Input
						label="Email or Phone"
						placeholder="Enter your email or phone number"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
						error={error || undefined}
						showErrorText={false}
					/>
				</View>

				{/* PIN Input */}
				<Input
					label="PIN"
					placeholder="Enter your 4-digit PIN"
					value={pin}
					onChangeText={setPin}
					keyboardType="numeric"
					maxLength={4}
					secureTextEntry
					error={error || undefined}
					showErrorText={false}
				/>

				{/* Remember Me & Forgot PIN */}
				<View className="mt-1 mb-6 flex-row items-center justify-between">
					<TouchableOpacity
						className="flex-row items-center"
						onPress={() => setRememberMe(!rememberMe)}
					>
						<View
							className={`mr-2 h-[18px] w-[18px] items-center justify-center rounded-[3px] border ${
								rememberMe ? 'border-primary bg-primary' : 'border-text-primary'
							}`}
						>
							{rememberMe && (
								<Ionicons name="checkmark" size={14} color={COLORS.white} />
							)}
						</View>
						<Text className="text-xs text-text-primary">Remember Me</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={handleForgotPin}>
						<Text className="text-xs font-plus-medium text-accent underline">
							Forgot PIN?
						</Text>
					</TouchableOpacity>
				</View>

				{/* Login Button Row */}
				<View className="mb-4 flex-row items-center">
					<Button
						title="LOGIN"
						onPress={handleLogin}
						loading={isLoading}
						className="flex-1 mr-3"
					/>
					<TouchableOpacity
						className="h-[56px] w-[56px] items-center justify-center rounded-xl bg-primary-light"
						onPress={handleBiometric}
					>
						<MaterialCommunityIcons
							name="fingerprint"
							size={28}
							color={COLORS.white}
						/>
					</TouchableOpacity>
				</View>

				{/* Sign Up Link */}
				<View className="flex-row items-center justify-center">
					<Text className="text-sm text-text-primary">
						Don't have an account yet?{' '}
					</Text>
					<TouchableOpacity onPress={handleSignUp}>
						<Text className="text-sm text-accent underline">
							Sign up here
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</AuthLayout>
	);
};

export default LoginScreen;
